import { FC } from 'react';
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

export interface FolderHavingAudioFiles {
  id: number;
  name: string;
  files: MediaLibrary.Asset[];
}

const AudioFolderItem: FC<
  FolderHavingAudioFiles & { style?: StyleProp<ViewStyle> }
> = ({ id, name, files, style }) => {
  const [open, setOpen] = useState(false);

  const handlePress = () => {
    setOpen((open) => !open);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={handlePress}
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
