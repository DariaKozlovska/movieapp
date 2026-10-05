import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TMDB_IMAGE_URL } from '../constants/config';
import { Movie } from '../models/Movie';
import { WatchedMovie } from '../models/WatchedMovie';
import StarRating from './StarRating';
import { Colors } from '@/constants/colors';
import { Color } from 'expo-router';
import { Fonts } from '@/constants/fonts';

interface Props {
  movie: Movie | WatchedMovie;
  userRating?: number;
  userReview?: string;
  onRemove: () => void;
  onEdit?: () => void;
  onPress?: () => void;
  isWatched?: boolean; 
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

      {movie.poster_path ? (
        <Image
          source={{ uri: `${TMDB_IMAGE_URL}${movie.poster_path}` }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>Brak okładki</Text>
        </View>
      )}
      {/* <Image
        source={{ uri: `${TMDB_IMAGE_URL}${movie.poster_path}` }}
        style={styles.image}
      /> */}

      <View style={styles.infoBlock}>
        <View style={styles.topBlock}>
          <View style={styles.textBlock}>
            <Text style={styles.title} numberOfLines={2}>
              {movie.title}
            </Text>
            {isWatched ? (
              <StarRating rating={userRating ?? 0} onChange={() => {}} />
            ) : (
              <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'flex-end'}}>
                <Text style={{ fontSize: 16, color: Colors.text, marginRight: 2, fontFamily: Fonts.bold }}>
                  {userRating?.toFixed(1)}
                </Text>
                <Image source={require('@/assets/images/Star.png')} style={{ width: 20, height: 20 }} />
              </View>
            )}
          </View>
          <View style={styles.rightBlock}>
            <TouchableOpacity
              onPress={confirmRemove}
            >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 18,
                backgroundColor: Colors.red,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="close" size={24} color={Colors.text} />
            </View>
            </TouchableOpacity>

            {isWatched && onEdit && (
              <TouchableOpacity onPress={onEdit} style={{ marginTop: 8 }}>
                <View 
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: Colors.green,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="pencil" size={18} color={Colors.text} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isWatched ? (
          userReview ? (
          <View>
            <Text style={styles.review} numberOfLines={3}>
              {'"'}{userReview}{'"'}
            </Text>
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
  container: { flex: 1, backgroundColor: Colors.background },
  listContent: { padding: 16, paddingBottom: 32, flexGrow: 1 },

  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  emptyText: { color: Colors.text, fontSize: 18 },

  card: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    
  },

  noImage: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
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
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: { width: 110, minHeight: 150, alignSelf: 'stretch', resizeMode: 'cover' },
  infoBlock: { flex: 1, padding: 12, justifyContent: 'space-between' },
  textBlock: { flex: 1, paddingRight: 26, justifyContent: 'flex-start' },
  topBlock: { flex: 1, flexDirection: 'row', justifyContent: 'space-between'},
  title: { color: Colors.text, fontSize: 24, fontFamily: Fonts.bold },
  rating: { marginTop: 6, color: Colors.text, fontSize: 14 },
  rightBlock: { alignItems: 'flex-end' },
  removeText: { color: Colors.red, fontSize: 20, fontWeight: '700' },
  watchedButton: { backgroundColor: Colors.green, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  watchedText: { color: Colors.text, fontSize: 18, fontFamily: Fonts.bold, textAlign: 'center', paddingVertical: 8 },
});