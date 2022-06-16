import { View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import AudioList from './src/screens/AudioList';

export default function App() {
  const [sound, setSound] = useState<Audio.Sound>();

  const playSound = async () => {
    // loading sound
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/sample-music.mp3')
    );

    setSound(sound);

    // playing sound
    await sound.playAsync();
  };

  useEffect(() => {
    return () => {
      if (sound) {
        // unloading sound
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <AudioList />
      <Button title="Play Sound" onPress={playSound} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
