import { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import QueueListItem from '../components/QueueListItem';
import color from '../constants/color';
import { AudioContext } from '../contexts/audio';

const QueueScreen = () => {
  const { queue, filename } = useContext(AudioContext);

  return (
    <ScrollView style={styles.container}>
      {queue.map((file) => (
        <QueueListItem
          key={file.id}
          name={file.filename}
          isSelected={file.filename === filename}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
});

export default QueueScreen;
