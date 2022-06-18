import { FC, useContext, useEffect } from 'react';
import * as MediaLibrary from 'expo-media-library';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useState } from 'react';
import { Audio } from 'expo-av';
import { AudioContext, PlayBackStatus } from '../contexts/audio';
import color from '../constants/color';

export interface FolderHavingAudioFiles {
  id: number;
  name: string;
  files: MediaLibrary.Asset[];
}

const AudioFolderItem: FC<
  FolderHavingAudioFiles & { style?: StyleProp<ViewStyle> }
> = ({ id, name, files, style }) => {
  const {
    changeFile,
    sound,
    changeSound,
    playbackStatus,
    changePlaybackStatus,
  } = useContext(AudioContext);

  const [open, setOpen] = useState(false);

  const handlePressFolder = () => {
    setOpen((open) => !open);
  };

  const stop = async () => {
    await sound?.setStatusAsync({ shouldPlay: false });
    await sound?.unloadAsync();
  };

  const play = async (file: MediaLibrary.Asset) => {
    changeFile(file);

    const newSound = new Audio.Sound();
    changeSound(newSound);

    try {
      const playbackStatus = await newSound.loadAsync(
        { uri: file.uri },
        { shouldPlay: true, volume: 0.5 }
      );
      changePlaybackStatus(playbackStatus as PlayBackStatus);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const handlePressFile = async (file: MediaLibrary.Asset) => {
    if (playbackStatus?.isLoaded) {
      await stop();
    }
    await play(file);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handlePressFolder}
        activeOpacity={0.7}
        style={[styles.summaryContainer, { borderBottomWidth: open ? 1 : 0 }]}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
      {open ? (
        <View style={styles.detailsContainer}>
          {files.map((file, index) => (
            <TouchableOpacity
              key={file.id}
              onPress={() => handlePressFile(file)}
              activeOpacity={0.5}
              style={[
                styles.fileContainer,
                { borderBottomWidth: index === files.length - 1 ? 0 : 1 },
              ]}
            >
              <Text>{file.filename}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  summaryContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: color.border,
    backgroundColor: color.primary,
  },
  detailsContainer: {
    borderColor: color.border,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: color.background,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  fileContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: color.border,
  },
});

export default AudioFolderItem;
