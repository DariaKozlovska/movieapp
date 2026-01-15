import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
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
  placeholderTitle?: string;
  onChangeTitle?: (text: string) => void;
}

export default function AddWatchedModal({
  visible,
  title,
  placeholderTitle = 'Tytuł filmu',
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={styles.modalOverlay}
      >
        <View style={styles.modal}>
          {/* Tytuł */}
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

          {/* Ocena */}
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Twoja ocena</Text>
            <StarRating rating={rating} onChange={onChangeRating} />
          </View>

          {/* Opinia */}
          <TextInput
            placeholder="Twoja opinia"
            placeholderTextColor="#888"
            style={[styles.input, styles.textArea]}
            multiline
            value={review}
            onChangeText={onChangeReview}
            maxLength={maxLength}
          />

          {/* Przyciski */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Anuluj</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.buttonText}>Zapisz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  label: {
    color: '#fff',
    marginBottom: 6,
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
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e50914',
  },
  saveButton: {
    backgroundColor: 'rgba(0,255,0,0.6)',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});