import React, { useEffect, useMemo, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import AudioFolderItem, {
  FolderHavingAudioFiles,
} from '../components/AudioFolderItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AudioFolder = {
  [audioFiles: string]: MediaLibrary.Asset[];
};

const AudioList = () => {
  const insets = useSafeAreaInsets();

  const [audios, setAudios] = useState<MediaLibrary.Asset[]>([]);

  const permissionAlert = () => {
    Alert.alert(
      '파일 접근 권한이 필요합니다.',
      '오디오 파일을 불러올 권한이 있어야 합니다.',
      [{ text: 'ok', onPress: getPermission }]
    );
  };

  const getAudioFiles = async () => {
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
    });

    const { totalCount } = media;

    media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: totalCount, // The maximum number of items on a single page.
    });

    setAudios(media.assets);
  };

  const getPermission = async () => {
    try {
      const permission = await MediaLibrary.getPermissionsAsync();

      if (permission.granted) {
        getAudioFiles();
      } else if (permission.canAskAgain) {
        const { status, canAskAgain } =
          await MediaLibrary.requestPermissionsAsync();

        if (status === 'granted') {
          getAudioFiles();
        } else if (canAskAgain) {
          permissionAlert();
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  const foldersHavingAudioFiles: FolderHavingAudioFiles[] = useMemo(() => {
    const audioFolder: AudioFolder = {};
    const results: FolderHavingAudioFiles[] = [];
    let folderId = 0;

    // sort by folder
    audios.forEach((audioFile) => {
      const paths = audioFile.uri.split('/');
      const folderName = paths[paths.length - 2] ?? 'none';
      const parentFolderName = paths[paths.length - 3] ?? 'none';
      const fullFolderName = parentFolderName + '/' + folderName;

      const isFolderExist = !!audioFolder[fullFolderName];
      if (!isFolderExist) {
        audioFolder[fullFolderName] = [];
      }

      const audioFiles = audioFolder[fullFolderName];
      audioFiles.push(audioFile);
    });

    // change data structure
    for (const key in audioFolder) {
      const audioFiles = audioFolder[key];
      folderId++;

      const folder = {
        id: folderId,
        name: key,
        files: audioFiles,
      };

      results.push(folder);
    }

    return results;
  }, [audios]);

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      {foldersHavingAudioFiles.map((folder, index) => (
        <AudioFolderItem
          key={folder.id}
          {...folder}
          style={{
            marginBottom: index !== foldersHavingAudioFiles.length - 1 ? 10 : 0,
          }}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

export default AudioList;
