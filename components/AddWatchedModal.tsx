import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import StarRating from './StarRating';
import { KeyboardAvoidingView, Platform } from 'react-native';

interface Props {
  visible: boolean;
  title?: string;
  rating: number;
  review: string;
  maxLength: number;
  onChangeRating: (v: number) => void;
  onChangeReview: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AddWatchedModal({
  visible,
  title,
  rating,
  review,
  maxLength,
  onChangeRating,
  onChangeReview,
  onCancel,
  onSave,
}: Props) {
  if (!title) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        > 
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                <Text style={styles.title}>{title}</Text>

                <Text style={styles.label}>Twoja ocena jest wyłącznie dla Ciebie, nie będzie widoczna dla innych użytkowników.</Text>
                <StarRating rating={rating} onChange={onChangeRating} />

                <TextInput
                    placeholder="Twoja opinia"
                    placeholderTextColor="#888"
                    style={[styles.input, styles.textArea]}
                    multiline
                    value={review}
                    onChangeText={onChangeReview}
                    maxLength={maxLength}
                />

                <Text style={styles.counter}>
                    {review.length}/{maxLength}
                </Text>

                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.cancel} onPress={onCancel}>
                    <Text style={styles.buttonText}>Anuluj</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.save} onPress={onSave}>
                    <Text style={styles.buttonText}>Zapisz</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>

    
  );
}

const styles = StyleSheet.create({
  overlay: {
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
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    color: '#fff',
    marginBottom: 6,
    fontStyle: 'italic',
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
    marginTop: 12,
  },
  counter: {
    color: '#888',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cancel: {
    flex: 1,
    backgroundColor: '#e50914',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  save: {
    flex: 1,
    backgroundColor: 'rgba(0,255,0,0.6)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});