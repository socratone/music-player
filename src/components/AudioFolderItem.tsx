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
import { AudioContext } from '../contexts/audio';

export interface FolderHavingAudioFiles {
  id: number;
  name: string;
  files: MediaLibrary.Asset[];
}

const AudioFolderItem: FC<
  FolderHavingAudioFiles & { style?: StyleProp<ViewStyle> }
> = ({ id, name, files, style }) => {
  const { sound, changeSound, playbackStatus, changePlaybackStatus } =
    useContext(AudioContext);

  const [open, setOpen] = useState(false);

  const handlePressFolder = () => {
    setOpen((open) => !open);
  };

  const stop = async () => {
    await sound?.setStatusAsync({ shouldPlay: false });
  };

  const play = async (file: MediaLibrary.Asset) => {
    const newSound = new Audio.Sound();
    changeSound(newSound);

    const playbackStatus = await newSound.loadAsync(
      { uri: file.uri },
      { shouldPlay: true, volume: 0.5 }
    );
    changePlaybackStatus(playbackStatus);
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
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ededed',
    overflow: 'hidden',
  },
  summaryContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ededed',
    backgroundColor: '#c6e7ff',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
  },
  fileContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: '#ededed',
  },
});

export default AudioFolderItem;
