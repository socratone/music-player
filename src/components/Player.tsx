import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import color from '../constants/color';
import { AudioContext } from '../contexts/audio';
import { FontAwesome5 } from '@expo/vector-icons';

const Player: React.FC = () => {
  const { file, resume, pause, playbackStatus } = useContext(AudioContext);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{file?.filename}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={playbackStatus?.isPlaying ? pause : resume}
          style={styles.button}
          activeOpacity={0.5}
        >
          {playbackStatus?.isPlaying ? (
            <FontAwesome5 name="pause" size={22} color={color.font} />
          ) : (
            <FontAwesome5 name="play" size={22} color={color.font} />
          )}
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
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primary,
  },
  buttonText: {
    fontWeight: '600',
    color: color.font,
  },
});

export default Player;
