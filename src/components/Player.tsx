import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import color from '../constants/color';
import { AudioContext } from '../contexts/audio';
import { FontAwesome5 } from '@expo/vector-icons';

const Player: React.FC = () => {
  const { file, resume, pause, isPlaying, playNext, playPrevious } =
    useContext(AudioContext);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{file?.filename}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={playPrevious}
          style={styles.button}
          activeOpacity={0.5}
        >
          <FontAwesome5 name="step-backward" size={22} color={color.font} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={isPlaying ? pause : resume}
          style={styles.button}
          activeOpacity={0.5}
        >
          {isPlaying ? (
            <FontAwesome5 name="pause" size={22} color={color.font} />
          ) : (
            <FontAwesome5 name="play" size={22} color={color.font} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={playNext}
          style={styles.button}
          activeOpacity={0.5}
        >
          <FontAwesome5 name="step-forward" size={22} color={color.font} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderColor: color.border,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoText: {
    color: '#d8d7d7',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    color: color.font,
  },
});

export default Player;
