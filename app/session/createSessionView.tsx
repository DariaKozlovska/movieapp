import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import Selector from '@/components/Selectors/Selector';
import Counter from '@/components/Counter/Counter';
import AppButton from '@/components/Button/AppButton';

import { GENRES } from '@/constants/genres';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

import { useMovies } from '@/hooks/useMovies';
import useCreateSessionViewModel from '@/models/createSession';

export default function CreateSessionView() {
  const {
    participantCount,
    participantNames,
    updateParticipantCount,
    updateParticipantName,
    generateSession,
  } = useCreateSessionViewModel();

  const { selectedGenre, setSelectedGenre } = useMovies();

  // Refs to every name input, so "next" on the keyboard focuses the next one
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleGenerateSession = () => {
    const result = generateSession();

    if (!result.success) {
      Alert.alert('Brak danych', result.message);
      return;
    }

    Alert.alert(
      'Sesja',
      `Przygotowano dane sesji dla ${result.data.participantCount} osób.`,
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Liczba uczestników</Text>

          <Counter
            value={participantCount}
            min={2}
            max={6}
            onChange={updateParticipantCount}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Gatunek</Text>

          <Selector
            style={styles.selector}
            options={GENRES}
            selectedOption={selectedGenre}
            onSelectOption={setSelectedGenre}
            placeholder="Wybierz kategorię"
          />
        </View>

        {/* Imiona uczestników */}
        <View style={styles.namesSection}>
          <View style={styles.namesCard}>
            {participantNames.map((name, index) => {
              const isLast = index === participantNames.length - 1;

              return (
                <View key={index}>
                  {index > 0 && <View style={styles.divider} />}

                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={styles.nameInput}
                    value={name}
                    onChangeText={(text) => updateParticipantName(index, text)}
                    placeholder={
                      index === 0
                        ? 'Twoje imię *'
                        : `Uczestnik ${index + 1} (opcjonalnie)`
                    }
                    placeholderTextColor={Colors.border}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType={isLast ? 'done' : 'next'}
                    blurOnSubmit={isLast}
                    onSubmitEditing={() => {
                      if (!isLast) inputRefs.current[index + 1]?.focus();
                    }}
                    accessibilityLabel={
                      index === 0 ? 'Twoje imię' : `Imię uczestnika ${index + 1}`
                    }
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Generowanie sesji */}
      <View style={styles.footer}>
        <Text style={[styles.description, { textAlign: 'center' }]}>
          Po stworzeniu pokoju wygeneruje się QR kod oraz hasło, za pomocą
          których uczestnicy będą mogli wejść do pokoju
        </Text>

        <AppButton
          title="Generuj sesję"
          onPress={handleGenerateSession}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 30 },

  content: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 32,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    gap: 12,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 20,
    color: Colors.text,
    fontFamily: Fonts.bold,
  },

  selector: {
    marginTop: 0,
  },

  namesSection: {
    marginTop: 24,
  },

  description: {
    marginTop: 8,
    marginBottom: 20,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 20,
  },

  namesCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 22,
    overflow: 'hidden',
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  nameInput: {
    height: 56,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
    paddingVertical: 0,
  },

  footer: {
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
});