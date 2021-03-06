import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AudioProvider from './src/contexts/audio';
import color from './src/constants/color';
import Navigation from './src/Navigation';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';

export default function App() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(color.background);
  }, []);

  return (
    <AudioProvider>
      <SafeAreaProvider style={styles.container}>
        <StatusBar
          animated={true}
          barStyle="light-content"
          showHideTransition="slide"
          backgroundColor={color.background}
        />
        <Navigation />
      </SafeAreaProvider>
    </AudioProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background,
  },
});
