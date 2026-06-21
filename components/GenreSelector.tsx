import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

interface Genre {
  id: number | null;
  name: string;
}

interface Props {
  genres: Genre[];
  selectedGenre: number | null;
  onSelectGenre: (genreId: number | null) => void;
}

export default function GenreSelector({
  genres,
  selectedGenre,
  onSelectGenre,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {genres.map((genre) => (
        <TouchableOpacity
          key={genre.name}
          onPress={() => onSelectGenre(genre.id)}
          style={[
            styles.button,
            selectedGenre === genre.id &&
              styles.activeButton,
          ]}
        >
          <Text>{genre.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#ddd',
  },
});