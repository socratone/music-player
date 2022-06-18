import { Audio, AVPlaybackStatus } from 'expo-av';
import { createContext, useState } from 'react';

type Sound = Audio.Sound | null;
type PlayBackStatus = AVPlaybackStatus | null;

export const AudioContext = createContext({
  sound: null as Sound,
  changeSound: (sound: Sound) => {},
  playbackStatus: null as PlayBackStatus,
  changePlaybackStatus: (status: PlayBackStatus) => {},
});

const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sound, setSound] = useState<Sound>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlayBackStatus>(null);

  const changeSound = (sound: Sound) => {
    setSound(sound);
  };

  const changePlaybackStatus = (status: PlayBackStatus) => {
    setPlaybackStatus(status);
  };

  return (
    <AudioContext.Provider
      value={{
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
