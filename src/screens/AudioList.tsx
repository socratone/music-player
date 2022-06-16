import { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Alert, ScrollView, Text, View } from 'react-native';

const AudioList = () => {
  const [audios, setAudios] = useState<MediaLibrary.Asset[]>([]);

  const permissionAlert = () => {
    Alert.alert(
      '파일 접근 권한이 필요합니다.',
      '오디오 파일을 불러올 권한이 있어야 합니다.',
      [{ text: 'ok', onPress: getPermission }]
    );
  };

  const getAudioFiles = async () => {
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 100, // The maximum number of items on a single page.
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

  return (
    <ScrollView>
      {audios.map((audio) => (
        <View key={audio.id}>
          <Text>{audio.filename}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default AudioList;
