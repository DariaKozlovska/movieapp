import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import StarRating from './StarRating';
import { Movie } from '../models/Movie';

interface Props {
  visible: boolean;
  movie: Movie;
  onSave: (rating: number, review: string) => void;
  onClose: () => void;
}

export default function WatchedModal({ visible, movie, onSave, onClose }: Props) {
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{movie.title}</Text>

          <StarRating rating={rating} onChange={setRating} />

          <TextInput
            placeholder="Twoja opinia..."
            placeholderTextColor="#888"
            value={review}
            onChangeText={setReview}
            style={styles.input}
            multiline
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Anuluj</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onSave(rating, review)}
              style={styles.save}
            >
              <Text style={styles.saveText}>Zapisz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    marginTop: 12,
    minHeight: 80,
    color: '#fff',
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancel: {
    color: '#aaa',
    fontSize: 16,
  },
  save: {
    backgroundColor: '#e50914',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
});