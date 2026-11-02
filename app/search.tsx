import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Title from '@/components/Text/title';
import AppInput from '@/components/Input/AppInput';
import MovieCard from '@/components/MovieCard';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import useSearchViewModel from '@/hooks/useSearchViewModel';
import { BackButton } from '@/components/Button/BackButton';
export default function SearchScreen() {
  const router = useRouter();
  const {
    query,
    setQuery,
    movies,
    isLoading,
    error,
    clearSearch,
  } = useSearchViewModel();
  const hasQuery = query.trim().length > 0;
  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };
  return (
    <View style={styles.container}>
      <BackButton />
      <Title title="Wyszukiwarka" />
      <View style={styles.searchContainer}>
        <AppInput
          placeholder="Wpisz tytuł filmu..."
          value={query}
          onChangeText={setQuery}
          rightIcon={hasQuery ? 'close-circle' : 'search'}
          onRightIconPress={hasQuery ? clearSearch : undefined}
          rightIconAccessibilityLabel={
            hasQuery ? 'Wyczyść wyszukiwanie' : 'Wyszukaj film'
          }
        />
      </View>
      {isLoading && movies.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color={Colors.text}
          />
          <Text style={styles.emptyText}>
            Wyszukiwanie filmów...
          </Text>
        </View>
      ) : error && movies.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name="alert-circle-outline"
            size={44}
            color={Colors.text}
          />
          <Text style={styles.emptyTitle}>
            Wystąpił błąd
          </Text>
          <Text style={styles.emptyText}>
            {error}
          </Text>
        </View>
      ) : !hasQuery ? (
        <View style={styles.center}>
          <Ionicons
            name="search-outline"
            size={48}
            color={Colors.text}
          />
          <Text style={styles.emptyTitle}>
            Zacznij wyszukiwanie
          </Text>
          <Text style={styles.emptyText}>
            Wpisz tytuł filmu, aby znaleźć interesujące Cię produkcje.
          </Text>
        </View>
      ) : movies.length === 0 && !isLoading ? (
        <View style={styles.center}>
          <Ionicons
            name="film-outline"
            size={48}
            color={Colors.text}
          />
          <Text style={styles.emptyTitle}>
            Brak wyników
          </Text>
          <Text style={styles.emptyText}>
            Nie znaleziono filmu dla podanej frazy.
          </Text>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color={Colors.text}
              style={styles.loadingIndicator}
            />
          )}
          <FlatList
            data={movies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MovieCard
                movie={item}
                userRating={item.vote_average}
                onPress={() => handleMoviePress(item.id)}
                isWatched={false}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    marginTop: 24,
    marginBottom: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  loadingIndicator: {
    marginBottom: 12,
  },
  list: {
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 22,
    fontFamily: Fonts.bold,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  emptyText: {
    color: Colors.text,
    opacity: 0.7,
    fontSize: 16,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 12,
  },
});