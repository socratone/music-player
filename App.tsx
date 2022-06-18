import { View, StyleSheet } from 'react-native';
import AudioList from './src/screens/AudioList';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AudioProvider from './src/contexts/audio';

export default function App() {
  return (
    <SafeAreaProvider>
      <AudioProvider>
        <View style={styles.container}>
          <AudioList />
        </View>
      </AudioProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
