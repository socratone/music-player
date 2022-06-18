import { FC } from 'react';
import * as MediaLibrary from 'expo-media-library';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

export interface FolderHavingAudioFiles {
  id: number;
  name: string;
  files: MediaLibrary.Asset[];
}

const AudioFolderItem: FC<
  FolderHavingAudioFiles & { style?: StyleProp<ViewStyle> }
> = ({ id, name, files, style }) => {
  return (
    <TouchableOpacity style={[styles.container, style]} activeOpacity={0.5}>
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gainsboro',
    paddingVertical: 10,
  },
});

export default AudioFolderItem;
