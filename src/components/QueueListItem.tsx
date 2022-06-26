import { StyleSheet, Text, View } from 'react-native';
import color from '../constants/color';

interface IQueueListItemProps {
  name: string;
  isSelected: boolean;
}

const QueueListItem: React.FC<IQueueListItemProps> = ({ name, isSelected }) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isSelected ? color.primary : undefined },
      ]}
    >
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: color.border,
  },
  name: {
    color: color.font,
  },
});

export default QueueListItem;
