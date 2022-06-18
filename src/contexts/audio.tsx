import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import { createContext, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { useEffect } from 'react';

type File = MediaLibrary.Asset | null;
type Sound = Audio.Sound | null;
export type PlayBackStatus = AVPlaybackStatusSuccess | null;

export const AudioContext = createContext({
  file: null as File,
  sound: null as Sound,
  playbackStatus: null as PlayBackStatus,
  play: (file: MediaLibrary.Asset) => {},
  stop: () => {},
  resume: () => {},
  pause: () => {},
});

const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [file, setFile] = useState<File>(null);
  const [sound, setSound] = useState<Sound>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlayBackStatus>(null);

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
    await sound?.setStatusAsync({ shouldPlay: false });
    await sound?.unloadAsync();
  };

  const play = async (file: MediaLibrary.Asset) => {
    if (playbackStatus?.isLoaded) {
      await stop();
    }

    setFile(file);

    const sound = new Audio.Sound();
    setSound(sound);

    try {
      const playbackStatus = await sound.loadAsync(
        { uri: file.uri },
        { shouldPlay: true, volume: 0.5 }
      );
      setPlaybackStatus(playbackStatus as PlayBackStatus);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const resume = async () => {
    try {
      const status = await sound?.playAsync();
      if (status) {
        setPlaybackStatus(status as PlayBackStatus);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  const pause = async () => {
    try {
      const status = await sound?.setStatusAsync({ shouldPlay: false });
      if (status) {
        setPlaybackStatus(status as PlayBackStatus);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        file,
        sound,
        playbackStatus,
        play,
        stop,
        resume,
        pause,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
