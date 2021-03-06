import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import Player from '../components/Player';
import color from '../constants/color';
import { StackParamList } from '../Navigation';
import AudioList from '../components/AudioList';

type IHomeScreenProps = NativeStackScreenProps<StackParamList, 'Home'>;

const HomeScreen: React.FC<IHomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <AudioList />
      <Player navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
});

export default HomeScreen;
