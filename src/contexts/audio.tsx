import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import { createContext, useRef, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { useEffect } from 'react';

type File = MediaLibrary.Asset | null;
type Sound = Audio.Sound | null;

export const AudioContext = createContext({
  positionSeconds: 0,
  durationSeconds: 0,
  changePosition: (positionSeconds: number) => {},
  filename: '',
  queue: [] as File[],
  resume: () => {},
  pause: () => {},
  playFiles: (file: MediaLibrary.Asset[]) => {},
  isPlaying: false,
  playNext: () => {},
  playPrevious: () => {},
});

const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sound = useRef<Sound>();
  const playbackStatus = useRef<AVPlaybackStatusSuccess>();
  const [positionSeconds, setPositionSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [filename, setFilename] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<MediaLibrary.Asset[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  useEffect(() => {
    const setAudioMode = async () => {
      Audio.setAudioModeAsync({
        staysActiveInBackground: true,
      });
    };

    setAudioMode();

    return () => {
      stop();
    };
  }, []);

  // play next when finished
  useEffect(() => {
    // skip initial
    if (
      positionSeconds !== 0 &&
      durationSeconds !== 0 &&
      positionSeconds === durationSeconds
    ) {
      setQueueIndex((queueIndex) => {
        const nextQueueIndex = queueIndex + 1;
        const nextFlie = queue[nextQueueIndex];
        if (nextFlie) {
          play(nextFlie);
          return nextQueueIndex;
        }
        return queueIndex;
      });
    }
  }, [positionSeconds, durationSeconds]);

  const stop = async () => {
    await sound.current?.setStatusAsync({ shouldPlay: false });
    await sound.current?.unloadAsync();
  };

  const playNext = () => {
    const nextQueueIndex = queueIndex + 1;
    const nextFlie = queue[nextQueueIndex];
    if (nextFlie) {
      play(nextFlie);
      setQueueIndex(nextQueueIndex);
    }
  };

  const playPrevious = () => {
    // if 5 seconds have not passed
    if (
      playbackStatus.current &&
      playbackStatus.current.positionMillis > 5000
    ) {
      play(queue[queueIndex]);
    } else {
      const previousQueueIndex = queueIndex - 1;
      const previousFile = queue[previousQueueIndex];
      if (previousFile) {
        play(previousFile);
        setQueueIndex(previousQueueIndex);
      }
    }
  };

  const play = async (file: MediaLibrary.Asset) => {
    if (playbackStatus.current?.isLoaded) {
      await stop();
    }

    setFilename(file.filename);

    sound.current = new Audio.Sound();

    sound.current.setOnPlaybackStatusUpdate((status) => {
      try {
        const statusSuccess = status as AVPlaybackStatusSuccess;
        playbackStatus.current = statusSuccess;

        if (statusSuccess?.positionMillis && statusSuccess?.durationMillis) {
          setPositionSeconds(Math.floor(statusSuccess.positionMillis / 1000));
          setDurationSeconds(Math.floor(statusSuccess.durationMillis / 1000));
        }
      } catch (error) {
        console.log('error:', error);
      }
    });

    try {
      await sound.current.loadAsync(
        { uri: file.uri },
        { shouldPlay: true, volume: 0.5 }
      );
      setIsPlaying(true);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const resume = async () => {
    try {
      await sound.current?.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const pause = async () => {
    try {
      await sound.current?.setStatusAsync({ shouldPlay: false });
      setIsPlaying(false);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const playFiles = (files: MediaLibrary.Asset[]) => {
    setQueue(files);
    setQueueIndex(0);
    play(files[0]);
  };

  const changePosition = async (positionSeconds: number) => {
    await sound.current?.setStatusAsync({
      positionMillis: positionSeconds * 1000,
    });
  };

  return (
    <AudioContext.Provider
      value={{
        positionSeconds,
        durationSeconds,
        changePosition,
        filename,
        queue,
        resume,
        pause,
        playFiles,
        isPlaying,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
