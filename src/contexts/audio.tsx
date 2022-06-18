import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import { createContext, useRef, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { useEffect } from 'react';

type File = MediaLibrary.Asset | null;
type Sound = Audio.Sound | null;

export const AudioContext = createContext({
  file: null as File,
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
  const [file, setFile] = useState<File>(null);
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

  const stop = async () => {
    await sound.current?.setStatusAsync({ shouldPlay: false });
    await sound.current?.unloadAsync();
  };

  const playNext = () => {
    const nextFlie = queue[queueIndex + 1];
    if (queue.length > 0 && nextFlie) {
      setQueueIndex((queueIndex) => {
        play(nextFlie);
        return queueIndex + 1;
      });
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
      const previousFile = queue[queueIndex - 1];
      if (queue.length > 0 && previousFile) {
        setQueueIndex((queueIndex) => {
          play(previousFile);
          return queueIndex - 1;
        });
      }
    }
  };

  const play = async (file: MediaLibrary.Asset) => {
    if (playbackStatus.current?.isLoaded) {
      await stop();
    }

    setFile(file);

    sound.current = new Audio.Sound();

    sound.current.setOnPlaybackStatusUpdate((status) => {
      try {
        const statusSuccess = status as AVPlaybackStatusSuccess;
        playbackStatus.current = statusSuccess;

        if (statusSuccess.didJustFinish) {
          playNext();
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

  return (
    <AudioContext.Provider
      value={{
        file,
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
