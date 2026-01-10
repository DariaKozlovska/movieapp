import { Link } from 'expo-router';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { TMDB_IMAGE_URL } from '../../constants/config';
import { useMovies } from '../../hooks/useMovies';
import { Pressable } from 'react-native';

export default function HomeScreen() {
  const { movies, loading, error } = useMovies();

  if (loading) {
    return <ActivityIndicator size="large" style={styles.center} />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Link href={`/movie/${item.id}`} asChild>
          <Pressable style={styles.card}>
            <Image
              source={{ uri: `${TMDB_IMAGE_URL}${item.poster_path}` }}
              style={styles.image}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text numberOfLines={3}>{item.overview}</Text>
          </Pressable>
        </Link>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  image: {
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 6,
  },
});