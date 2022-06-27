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
  queue: [] as MediaLibrary.Asset[],
  resume: () => {},
  pause: () => {},
  playFiles: (file: MediaLibrary.Asset[]) => {},
  isPlaying: false,
  playNext: () => {},
  playPrevious: () => {},
  isRandom: false,
  changeIsRandom: (isRandom: boolean) => {},
  volume: 0.5,
  changeVolume: (volume: number) => {},
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
  const [isRandom, setIsRandom] = useState(false);
  const [queue, setQueue] = useState<MediaLibrary.Asset[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [randomQueue, setRandomQueue] = useState<MediaLibrary.Asset[]>([]);
  const [randomQueueIndex, setRandomQueueIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);

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
      if (isRandom) {
        setRandomQueueIndex((queueIndex) => {
          const nextQueueIndex = queueIndex + 1;
          const nextFlie = randomQueue[nextQueueIndex];
          if (nextFlie) {
            play(nextFlie);
            return nextQueueIndex;
          }
          return queueIndex;
        });
      } else {
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
    }
  }, [positionSeconds, durationSeconds]);

  const shuffleQueue = (queue: MediaLibrary.Asset[]) => {
    const array = [...queue];
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  useEffect(() => {
    if (isRandom) {
      const currentFile = queue[queueIndex];
      const otherFiles = queue.filter((file) => file.id !== currentFile.id);
      const suffledOthers = shuffleQueue(otherFiles);
      setRandomQueue([currentFile, ...suffledOthers]);
      setRandomQueueIndex(0);
    } else {
      // if random queue generated
      if (randomQueue.length > 0) {
        const currentFile = randomQueue[randomQueueIndex];
        const currentQueueIndex = queue.findIndex(
          (file) => file.id === currentFile.id
        );
        setQueueIndex(currentQueueIndex);
      }
    }
  }, [queue, isRandom]);

  const stop = async () => {
    await sound.current?.setStatusAsync({ shouldPlay: false });
    await sound.current?.unloadAsync();
    sound.current = null;
    playbackStatus.current = null;
  };

  const playNext = async () => {
    if (isRandom) {
      const nextQueueIndex = randomQueueIndex + 1;
      const nextFlie = randomQueue[nextQueueIndex];
      if (nextFlie) {
        await play(nextFlie);
        setRandomQueueIndex(nextQueueIndex);
      }
    } else {
      const nextQueueIndex = queueIndex + 1;
      const nextFlie = queue[nextQueueIndex];
      if (nextFlie) {
        await play(nextFlie);
        setQueueIndex(nextQueueIndex);
      }
    }
  };

  const playPrevious = async () => {
    // if 5 seconds have not passed
    if (
      playbackStatus.current &&
      playbackStatus.current.positionMillis > 5000
    ) {
      if (isRandom) {
        await play(randomQueue[randomQueueIndex]);
      } else {
        await play(queue[queueIndex]);
      }
    } else {
      if (isRandom) {
        const previousQueueIndex = randomQueueIndex - 1;
        const previousFile = randomQueue[previousQueueIndex];
        if (previousFile) {
          await play(previousFile);
          setRandomQueueIndex(previousQueueIndex);
        }
      } else {
        const previousQueueIndex = queueIndex - 1;
        const previousFile = queue[previousQueueIndex];
        if (previousFile) {
          await play(previousFile);
          setQueueIndex(previousQueueIndex);
        }
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
        { shouldPlay: true, volume }
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
    if (isRandom) {
      setQueue(files);
      setQueueIndex(0);
      const suffledFiles = shuffleQueue(files);
      setRandomQueue(suffledFiles);
      setRandomQueueIndex(0);
      await play(suffledFiles[0]);
    } else {
      setQueue(files);
      setQueueIndex(0);
      await play(files[0]);
    }
  };

  const changePosition = async (positionSeconds: number) => {
    await sound.current?.setStatusAsync({
      positionMillis: positionSeconds * 1000,
    });
  };

  const changeIsRandom = (isRandom: boolean) => {
    setIsRandom(isRandom);
  };

  const changeVolume = async (volume: number) => {
    try {
      await sound.current?.setStatusAsync({
        volume,
      });
      setVolume(volume);
    } catch (error) {
      console.log('change volume error:', error);
    }
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
        isRandom,
        changeIsRandom,
        volume,
        changeVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
