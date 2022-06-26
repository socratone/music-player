import { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import color from '../constants/color';
import { AudioContext } from '../contexts/audio';
import { FontAwesome5 } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenName, StackParamList } from '../Navigation';

interface IPlayerProps {
  navigation: NativeStackNavigationProp<StackParamList, ScreenName, undefined>;
}

const Player: React.FC<IPlayerProps> = ({ navigation }) => {
  const {
    positionSeconds,
    durationSeconds,
    changePosition,
    filename,
    resume,
    pause,
    isPlaying,
    playNext,
    playPrevious,
    isRandom,
    changeIsRandom,
  } = useContext(AudioContext);

  const timeText = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainSeconds = seconds % 60;
    let remainSecondsText = remainSeconds.toString();
    if (remainSecondsText.length === 1) {
      remainSecondsText = '0' + remainSecondsText;
    }
    return minutes + ':' + remainSecondsText;
  };

  const handleSlidingComplete = (seconds: number) => {
    changePosition(Math.floor(seconds));
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{filename}</Text>
      </View>
      <View>
        <Slider
          value={positionSeconds}
          style={styles.slider}
          minimumValue={0}
          maximumValue={durationSeconds}
          thumbTintColor="#fff"
          minimumTrackTintColor="#fff"
          maximumTrackTintColor="#fff"
          onSlidingComplete={handleSlidingComplete}
        />
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{timeText(positionSeconds)}</Text>
        <Text style={styles.timeText}>{timeText(durationSeconds)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Queue')}
          style={styles.button}
          activeOpacity={0.5}
        >
          <FontAwesome5 name="sync" size={22} color={color.font} />
        </TouchableOpacity>
        <View style={styles.centerButtons}>
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
        <TouchableOpacity
          onPress={() => changeIsRandom(!isRandom)}
          style={styles.button}
          activeOpacity={0.5}
        >
          <FontAwesome5
            name="random"
            size={22}
            color={isRandom ? color.font : color.border}
          />
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
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  infoText: {
    color: color.font,
  },
  slider: {
    width: '100%',
    height: 30,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  timeText: {
    fontSize: 12,
    color: color.font,
  },
  buttonContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerButtons: {
    flexDirection: 'row',
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
