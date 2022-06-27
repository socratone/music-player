import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import QueueListItem from '../components/QueueListItem';
import color from '../constants/color';
import { AudioContext } from '../contexts/audio';
import { StackParamList } from '../Navigation';

type IQueueScreenProps = NativeStackScreenProps<StackParamList, 'Queue'>;

const QueueScreen: React.FC<IQueueScreenProps> = ({ navigation }) => {
  const { queue, playFiles, filename } = useContext(AudioContext);

  const handlePress = (index: number) => {
    playFiles(queue, index);
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView style={styles.scroll}>
        {queue.map((file, index) => (
          <QueueListItem
            key={file.id}
            name={file.filename}
            isSelected={file.filename === filename}
            onPress={() => handlePress(index)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  scroll: {
    flex: 1,
  },
});

export default QueueScreen;
