import { View, StyleSheet, StatusBar } from 'react-native';
import AudioList from './src/screens/AudioList';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AudioProvider from './src/contexts/audio';
import Player from './src/components/Player';
import color from './src/constants/color';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        animated={true}
        barStyle="light-content"
        showHideTransition="slide"
        backgroundColor={color.background}
      />
      <AudioProvider>
        <View style={styles.container}>
          <AudioList />
          <Player />
        </View>
      </AudioProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
});
