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
import { AudioContext } from '../contexts/audio';
import color from '../constants/color';
import { FontAwesome5 } from '@expo/vector-icons';

export interface FolderHavingAudioFiles {
  id: number;
  name: string;
  files: MediaLibrary.Asset[];
}

const AudioFolderItem: FC<
  FolderHavingAudioFiles & { style?: StyleProp<ViewStyle> }
> = ({ id, name, files, style }) => {
  const { playFiles } = useContext(AudioContext);

  const [open, setOpen] = useState(false);

  const handlePressFolder = () => {
    setOpen((open) => !open);
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[styles.summaryContainer, { borderBottomWidth: open ? 1 : 0 }]}
      >
        <TouchableOpacity
          onPress={handlePressFolder}
          activeOpacity={0.7}
          style={styles.folderButton}
        >
          <Text style={styles.folderText}>{name}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => playFiles(files)}
          activeOpacity={0.7}
          style={styles.iconButton}
        >
          <FontAwesome5 name="play" size={15} color={color.font} />
        </TouchableOpacity>
      </View>
      {open ? (
        <View style={styles.detailsContainer}>
          {files.map((file, index) => (
            <TouchableOpacity
              key={file.id}
              onPress={() => playFiles(files, index)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: color.border,
    backgroundColor: color.primary,
  },
  folderButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  folderText: {
    color: color.font,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
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
