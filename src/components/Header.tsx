import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import color from '../constants/color';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenName, StackParamList } from '../Navigation';

interface IHeaderProps {
  navigation: NativeStackNavigationProp<StackParamList, ScreenName, undefined>;
}

const Header: React.FC<IHeaderProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Queue')}
        activeOpacity={0.5}
      >
        <FontAwesome5 name="list-ul" size={22} color={color.font} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.5}
      >
        <FontAwesome5 name="eject" size={22} color={color.font} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: color.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: '100%',
  },
});

export default Header;
