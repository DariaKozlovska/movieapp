import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TMDB_IMAGE_URL } from '../constants/config';
import { Movie } from '../models/Movie';
import { WatchedMovie } from '../models/WatchedMovie';
import StarRating from './StarRating';

interface Props {
  movie: Movie | WatchedMovie;
  userRating?: number;
  userReview?: string;
  onRemove: () => void;
  onEdit?: () => void;
  onPress?: () => void;
  isWatched?: boolean; // <- dodane
}

export default function MovieCard({
  movie,
  userRating,
  userReview,
  onRemove,
  onEdit,
  onPress,
  isWatched = false,
}: Props) {
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
            <StarRating rating={userRating ?? 0} onChange={() => {}} />
          </View>
          <TouchableOpacity
            onPress={onRemove}
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
        </View>

        {isWatched ? (
          userReview ? (
            <Text style={{ color: '#ccc', marginBottom: 8 }} numberOfLines={3}>
              "{userReview}"
            </Text>
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
  image: { width: 100, height: 150, resizeMode: 'cover' },
  infoBlock: { flex: 1, padding: 12, justifyContent: 'space-between' },
  textBlock: { flex: 1, paddingRight: 26, justifyContent: 'flex-start' },
  topBlock: { flex: 1, flexDirection: 'row', justifyContent: 'space-between'},
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  rating: { marginTop: 6, color: '#aaa', fontSize: 14 },
  rightBlock: { justifyContent: 'space-between', alignItems: 'flex-end' },
  removeButton: { padding: 4 },
  removeText: { color: '#e50914', fontSize: 20, fontWeight: '700' },
  watchedButton: { backgroundColor: 'rgba(0,255,0,0.6)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  watchedText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});