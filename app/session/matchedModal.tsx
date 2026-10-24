import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import AppButton from '@/components/Button/AppButton';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { TMDB_IMAGE_URL } from '@/constants/config';

import type { Movie } from '@/models/Movie';

type Props = {
  /** The movie everybody liked. The modal is visible while this is set. */
  movie: Movie | null;
  isAdmin: boolean;
  onContinue: () => void;
  onFinish: () => void;
  onLeave: () => void;
};

export default function MatchModal({
  movie,
  isAdmin,
  onContinue,
  onFinish,
  onLeave,
}: Props) {
  const posterUri = movie?.poster_path
    ? movie.poster_path.startsWith('http')
      ? movie.poster_path
      : `${TMDB_IMAGE_URL}${movie.poster_path}`
    : null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={movie !== null}
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Hura!</Text>
          <Text style={styles.subtitle}>
            Wszyscy uczestnicy wybrali ten film!
          </Text>

          {posterUri && (
            <Image source={{ uri: posterUri }} style={styles.poster} />
          )}

          <Text style={styles.movieTitle}>{movie?.title}</Text>
          <Text style={styles.wish}>Życzymy udanego seansu!</Text>

          {isAdmin ? (
            <>
              <AppButton
                title="Kontynuuj swipowanie"
                onPress={onContinue}
                variant="primary"
              />
              <AppButton
                title="Zakończ wybieranie"
                onPress={onFinish}
                variant="success"
                style={styles.secondButton}
              />
            </>
          ) : (
            <>
              <Text style={styles.hint}>
                Administrator zdecyduje, czy kontynuować wybieranie.
              </Text>
              <TouchableOpacity onPress={onLeave} activeOpacity={0.7}>
                <Text style={styles.leave}>Wyjdź</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },

  card: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
  },

  title: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 32,
  },

  subtitle: {
    marginTop: 12,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
    textAlign: 'center',
  },

  poster: {
    width: 190,
    height: 260,
    marginTop: 24,
    borderRadius: 16,
    resizeMode: 'cover',
  },

  movieTitle: {
    marginTop: 20,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 24,
    textAlign: 'center',
  },

  wish: {
    marginTop: 20,
    marginBottom: 20,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 18,
    textAlign: 'center',
  },

  secondButton: {
    marginTop: 12,
  },

  hint: {
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.75,
  },

  leave: {
    marginTop: 16,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 16,
    opacity: 0.7,
  },
});