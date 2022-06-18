import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import color from '../constants/color';
import { AudioContext, PlayBackStatus } from '../contexts/audio';

interface PlayerPorps {}

const Player: React.FC<PlayerPorps> = () => {
  const { file, sound, playbackStatus, changePlaybackStatus } =
    useContext(AudioContext);

  const handlePressPlay = async () => {
    try {
      const status = await sound?.playAsync();
      if (status) {
        changePlaybackStatus(status as PlayBackStatus);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  const handlePressStop = async () => {
    try {
      const status = await sound?.setStatusAsync({ shouldPlay: false });
      if (status) {
        changePlaybackStatus(status as PlayBackStatus);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text>{file?.filename}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={
            playbackStatus?.isPlaying ? handlePressStop : handlePressPlay
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {playbackStatus?.isPlaying ? 'PAUSE' : 'PLAY'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: color.border,
    backgroundColor: color.background,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primary,
  },
  buttonText: {
    fontWeight: '600',
  },
});

export default Player;
