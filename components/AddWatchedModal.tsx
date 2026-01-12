import React from 'react';
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import StarRating from './StarRating';

interface Props {
  visible: boolean;
  title?: string;
  rating: number;
  review: string;
  maxLength?: number;
  onChangeRating: (value: number) => void;
  onChangeReview: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  placeholderTitle?: string; // jeśli dodajemy własny film, możemy wpisać tytuł
  onChangeTitle?: (text: string) => void;
}

export default function AddWatchedModal({
  visible,
  title,
  placeholderTitle = "Tytuł filmu",
  rating,
  review,
  maxLength = 300,
  onChangeRating,
  onChangeReview,
  onCancel,
  onSave,
  onChangeTitle,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            {/* Tytuł lub input do tytułu własnego filmu */}
            {onChangeTitle ? (
              <TextInput
                placeholder={placeholderTitle}
                placeholderTextColor="#888"
                style={[styles.input, { marginBottom: 12 }]}
                value={title}
                onChangeText={onChangeTitle}
              />
            ) : (
              <Text style={styles.modalTitle}>{title}</Text>
            )}

            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: '#fff', marginBottom: 6 }}>Twoja ocena</Text>
              <StarRating rating={rating} onChange={onChangeRating} />
            </View>

            <TextInput
              placeholder="Twoja opinia"
              placeholderTextColor="#888"
              style={[styles.input, styles.textArea]}
              multiline
              value={review}
              onChangeText={onChangeReview}
              maxLength={maxLength}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#e50914' }]} onPress={onCancel}>
                <Text style={styles.buttonText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.buttonText}>Zapisz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modal: { width: '90%', backgroundColor: '#1A1A1A', borderRadius: 20, padding: 16 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: '#2A2A2A', color: '#fff', borderRadius: 12, padding: 10, fontSize: 14 },
  textArea: { height: 90, textAlignVertical: 'top', marginBottom: 12 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  saveButton: { flex: 1, backgroundColor: 'rgba(0,255,0,0.6)', paddingVertical: 12, borderRadius: 12, marginHorizontal: 4, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});