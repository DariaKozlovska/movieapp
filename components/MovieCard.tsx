import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TMDB_IMAGE_URL } from '../constants/config';
import { Movie } from '../models/Movie';
import { WatchedMovie } from '../models/WatchedMovie';
import StarRating from './StarRating';
import { Alert } from 'react-native';

interface Props {
  movie: Movie | WatchedMovie;
  userRating?: number;
  userReview?: string;
  onRemove: () => void;
  onEdit?: () => void;
  onPress?: () => void;
  isWatched?: boolean; 
}

const MAX_REVIEW_LENGTH = 100;

export default function MovieCard({
  movie,
  userRating,
  userReview,
  onRemove,
  onEdit,
  onPress,
  isWatched = false,
}: Props) {

  const confirmRemove = () => {
    Alert.alert(
      'Usuń film',
      'Czy na pewno chcesz usunąć ten film?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: onRemove,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image
        source={{ uri: `${TMDB_IMAGE_URL}${movie.poster_path}` }}
        style={styles.image}
      />

      <View style={styles.infoBlock}>
        <View style={styles.topBlock}>
          <View style={styles.textBlock}>
            <Text style={styles.title} numberOfLines={2}>
              {movie.title}
            </Text>
            {isWatched ? (
              <StarRating rating={userRating ?? 0} onChange={() => {}} />
            ) : (
              <Text style={styles.apiRating}>
                Rating: {userRating?.toFixed(1)}
              </Text>
            )}
          </View>
          <View style={styles.rightBlock}>
            <TouchableOpacity
              onPress={confirmRemove}
              style={styles.removeButton}
            >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#e50914',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="close" size={18} color="#fff" />
            </View>
            </TouchableOpacity>

            {isWatched && onEdit && (
              <TouchableOpacity onPress={onEdit} style={styles.removeButton}>
                <View 
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: 'rgba(0,255,0,0.6)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="pencil" size={18} color="#fff" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isWatched ? (
          userReview ? (
          <View>
            <Text style={styles.review} numberOfLines={3}>
              "{userReview}"
            </Text>
{/* 
            {onEdit && (
              <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                <Ionicons name="pencil" size={14} color="#00b894" />
                <Text style={styles.editText}>Edytuj</Text>
              </TouchableOpacity>
            )} */}
          </View>
          ) : null
        ) : (
          <TouchableOpacity
            style={styles.watchedButton}
            onPress={onEdit}
          >
            <Text style={styles.watchedText}>Już obejrzałem</Text>
          </TouchableOpacity>
        )}

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  listContent: { padding: 16, paddingBottom: 32, flexGrow: 1 },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  emptyText: { color: '#aaa', fontSize: 18 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },

  apiRating: {
    marginTop: 6,
    color: '#efdb94ff',
    fontSize: 14,
    fontWeight: '700',
  },
  review: {
    color: '#ccc',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  removeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e50914',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: { width: 100, minHeight: 150, alignSelf: 'stretch', resizeMode: 'cover' },
  infoBlock: { flex: 1, padding: 12, justifyContent: 'space-between' },
  textBlock: { flex: 1, paddingRight: 26, justifyContent: 'flex-start' },
  topBlock: { flex: 1, flexDirection: 'row', justifyContent: 'space-between'},
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  rating: { marginTop: 6, color: '#aaa', fontSize: 14 },
  rightBlock: { alignItems: 'flex-end' },
  removeButton: { padding: 4 },
  removeText: { color: '#e50914', fontSize: 20, fontWeight: '700' },
  watchedButton: { backgroundColor: 'rgba(0,255,0,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  watchedText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});