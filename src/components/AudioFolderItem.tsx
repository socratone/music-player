import { FC, useContext } from 'react';
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
  const { play } = useContext(AudioContext);

  const [open, setOpen] = useState(false);

  const handlePressFolder = () => {
    setOpen((open) => !open);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handlePressFolder}
        activeOpacity={0.7}
        style={[styles.summaryContainer, { borderBottomWidth: open ? 1 : 0 }]}
      >
        <Text style={styles.folderText}>{name}</Text>
      </TouchableOpacity>
      {open ? (
        <View style={styles.detailsContainer}>
          {files.map((file, index) => (
            <TouchableOpacity
              key={file.id}
              onPress={() => play(file)}
              activeOpacity={0.5}
              style={[
                styles.fileContainer,
                { borderBottomWidth: index === files.length - 1 ? 0 : 1 },
              ]}
            >
              <Text style={styles.fileText}>{file.filename}</Text>
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
  folderText: {
    color: color.font,
  },
  detailsContainer: {
    borderColor: color.border,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  fileContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderColor: color.border,
  },
  fileText: {
    color: color.font,
  },
});

export default AudioFolderItem;
