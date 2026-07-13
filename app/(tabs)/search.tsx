import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';

import ScreenContainer from '@/components/Screen/ScreenContainer';
import AppInput from '@/components/Input/AppInput';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>
          Wyszukiwarka filmów
        </Text>

        <View style={{ height: 24 }} />

        <AppInput
          placeholder="Wpisz tytuł filmu..."
          value={query}
          onChangeText={setQuery}
        />

        <View style={{ height: 32 }} />

        {query.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              Zacznij wyszukiwanie
            </Text>

            <Text style={styles.emptyText}>
              Wpisz nazwę filmu, aby znaleźć
              interesujące Cię produkcje.
            </Text>
          </View>
        ) : (
          <FlatList
            data={[]}
            keyExtractor={(_, index) =>
              index.toString()
            }
            renderItem={() => null}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                  Brak wyników
                </Text>

                <Text style={styles.emptyText}>
                  Nie znaleziono filmu {'"'}{query}{'"'}
                </Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  title: {
    color: Colors.text,
    fontSize: 30,
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
  },

  emptyTitle: {
    color: Colors.text,
    fontSize: 22,
    fontFamily: Fonts.bold,
    marginBottom: 12,
  },

  emptyText: {
    color: Colors.text,
    opacity: 0.7,
    fontSize: 18,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
});