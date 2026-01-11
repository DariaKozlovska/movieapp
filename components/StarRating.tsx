import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  rating: number;
  onChange: (value: number) => void;
  maxStars?: number; // nowy parametr
};

export default function StarRating({ rating, onChange, maxStars = 5 }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: maxStars }, (_, i) => i + 1).map(star => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={22}
            color="#f5c518"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
});