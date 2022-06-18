import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import { createContext, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { useEffect } from 'react';

type File = MediaLibrary.Asset | null;
type Sound = Audio.Sound | null;
export type PlayBackStatus = AVPlaybackStatusSuccess | null;

export const AudioContext = createContext({
  file: null as File,
  changeFile: (file: MediaLibrary.Asset) => {},
  sound: null as Sound,
  changeSound: (sound: Sound) => {},
  playbackStatus: null as PlayBackStatus,
  changePlaybackStatus: (status: PlayBackStatus) => {},
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

    (async () => {
      await setAudioMode();
    })();
  });

  const changeFile = (file: File) => {
    setFile(file);
  };

  const changeSound = (sound: Sound) => {
    setSound(sound);
  };

  const changePlaybackStatus = (status: PlayBackStatus) => {
    setPlaybackStatus(status);
  };

  return (
    <AudioContext.Provider
      value={{
        file,
        changeFile,
        sound,
        changeSound,
        playbackStatus,
        changePlaybackStatus,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
