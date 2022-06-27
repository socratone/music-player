import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import color from '../constants/color';

interface IQueueListItemProps {
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

const QueueListItem: React.FC<IQueueListItemProps> = ({
  name,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        { backgroundColor: isSelected ? color.primary : undefined },
      ]}
    >
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
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
