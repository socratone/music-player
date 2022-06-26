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
  const playbackStatus = useRef<AVPlaybackStatusSuccess | null>(null);
  const isRequestingPlay = useRef(false);
  const [positionSeconds, setPositionSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [filename, setFilename] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<MediaLibrary.Asset[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // enable background playing
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
    if (
      // skip initial
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
    sound.current = null;
    playbackStatus.current = null;
  };

  const playNext = async () => {
    const nextQueueIndex = queueIndex + 1;
    const nextFlie = queue[nextQueueIndex];
    if (nextFlie) {
      await play(nextFlie);
      setQueueIndex(nextQueueIndex);
    }
  };

  const playPrevious = async () => {
    // if 5 seconds have not passed
    if (
      playbackStatus.current &&
      playbackStatus.current.positionMillis > 5000
    ) {
      await play(queue[queueIndex]);
    } else {
      const previousQueueIndex = queueIndex - 1;
      const previousFile = queue[previousQueueIndex];
      if (previousFile) {
        await play(previousFile);
        setQueueIndex(previousQueueIndex);
      }
    }
  };

  const play = async (file: MediaLibrary.Asset) => {
    // prevent duplicate playing
    if (isRequestingPlay.current === true) return;
    isRequestingPlay.current = true;

    await stop();

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

    isRequestingPlay.current = false;
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

  const playFiles = async (files: MediaLibrary.Asset[]) => {
    setQueue(files);
    setQueueIndex(0);
    await play(files[0]);
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
