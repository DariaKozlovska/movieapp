import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useWatchedMovies } from '../contexts/WatchedMoviesContext';
import StarRating from './StarRating';
import { Movie } from '../models/Movie';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AddCustomMovieModal({ visible, onClose }: Props) {
  const { addWatchedMovie } = useWatchedMovies();
  const [title, setTitle] = useState('');
  const [poster, setPoster] = useState('');
  const [overview, setOverview] = useState(''); // opis filmu
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');
  const [trailerUrl, setTrailerUrl] = useState(''); // nowy URL zwiastuna

  const submit = () => {
    if (!title.trim()) return;

    const customMovie: Movie = {
      id: Date.now(),
      title: title.trim(),
      poster_path: poster.trim(),
      vote_average: rating,
      overview: overview.trim(),
      release_date: '',
      trailer_url: trailerUrl.trim() || undefined, // jeśli nie podano, undefined
    };

    addWatchedMovie(customMovie, rating, review);

    // reset pól
    setTitle('');
    setPoster('');
    setOverview('');
    setRating(3);
    setReview('');
    setTrailerUrl('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Dodaj własny film</Text>

            <TextInput
              placeholder="Tytuł filmu"
              placeholderTextColor="#888"
              style={[styles.input, { marginBottom: 12 }]}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              placeholder="URL okładki (opcjonalnie)"
              placeholderTextColor="#888"
              style={[styles.input, { marginBottom: 12 }]}
              value={poster}
              onChangeText={setPoster}
            />

            <TextInput
              placeholder="Opis filmu"
              placeholderTextColor="#888"
              style={[styles.input, styles.textArea]}
              multiline
              value={overview}
              onChangeText={setOverview}
            />

            <TextInput
              placeholder="URL zwiastuna (opcjonalnie)"
              placeholderTextColor="#888"
              style={[styles.input, { marginBottom: 12 }]}
              value={trailerUrl}
              onChangeText={setTrailerUrl}
            />

            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: '#fff', marginBottom: 6 }}>Twoja ocena</Text>
              <StarRating rating={rating} onChange={setRating} />
            </View>

            <TextInput
              placeholder="Twoja opinia"
              placeholderTextColor="#888"
              style={[styles.input, styles.textArea]}
              multiline
              value={review}
              onChangeText={setReview}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: '#e50914' }]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={submit}>
                <Text style={styles.buttonText}>Dodaj film</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: '#fff',
    borderRadius: 12,
    padding: 10,
    fontSize: 14,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'rgba(0,255,0,0.6)',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});