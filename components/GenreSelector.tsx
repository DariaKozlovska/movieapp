import React, { useState } from 'react';
import {
  View,
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
  const [opened, setOpened] = useState(false);

  const selected =
    genres.find((g) => g.id === selectedGenre)?.name ||
    'Wybierz kategorię';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setOpened((prev) => !prev)}
      >
        <Text style={styles.selectorText}>
          {selected}
        </Text>
      </TouchableOpacity>

      {opened && (
        <View style={styles.dropdown}>
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre.name}
              style={styles.option}
              onPress={() => {
                onSelectGenre(genre.id);
                setOpened(false);
              }}
            >
              <Text style={styles.optionText}>
                {genre.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1000,
  },

  selector: {
    width: 150,
    height: 50,

    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#23211E',

    borderWidth: 1,
    borderColor: '#6F6F6F',
  },

  selectorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  dropdown: {
    position: 'absolute',
    top: 58,

    width: 150,

    backgroundColor: '#23211E',

    borderRadius: 14,

    borderWidth: 1,
    borderColor: '#6F6F6F',

    overflow: 'hidden',

    zIndex: 9999,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  optionText: {
    color: '#fff',
    textAlign: 'center',
  },
});