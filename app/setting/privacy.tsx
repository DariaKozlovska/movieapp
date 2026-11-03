import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import Title from '@/components/Text/title';
import HelpButton from '@/components/Button/HelpButton';
import { BackButton } from '@/components/Button/BackButton';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

// ---- Fill these in -----------------------------------------------------
const LAST_UPDATE = '03-11-2026';
const ADMIN_NAME = 'Daria Kozlovska';
const CONTACT_EMAIL = 'odriy.lovska@gmail.com';
// ------------------------------------------------------------------------

type PolicySection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

const SECTIONS: PolicySection[] = [
  {
    title: '1. Kto odpowiada za dane',
    paragraphs: [
      `Administratorem danych w aplikacji Matched jest ${ADMIN_NAME}. Kontakt: ${CONTACT_EMAIL}.`,
    ],
  },
  {
    title: '2. Jakie dane zbieramy',
    bullets: [
      'Dane konta: imię, adres e-mail i hasło. Hasło jest przechowywane w bezpiecznej postaci przez Firebase Authentication i nie mamy do niego dostępu.',
      'Dane pokoi: gdy tworzysz pokój lub do niego dołączasz, zapisujemy Twoje imię, kod pokoju oraz filmy, które polubisz w trakcie wspólnego wyboru.',
      'Polubione i obejrzane filmy, oceny i opinie.',
      'Wpisane w wyszukiwarce tytuły filmów są wysyłane do serwisu TMDB, aby wyświetlić wyniki.',
    ],
  },
  {
    title: '3. Do czego używamy danych',
    paragraphs: [
      'Wyłącznie do działania aplikacji: logowania, tworzenia pokoi, wspólnego wyboru filmu oraz zapisywania Twoich list filmów. Nie sprzedajemy danych i nie wyświetlamy reklam.',
    ],
  },
  {
    title: '4. Aparat',
    paragraphs: [
      'Aparat służy tylko do skanowania kodu QR pokoju. Nie zapisujemy zdjęć ani nagrań.',
    ],
  },
  {
    title: '5. Gdzie przechowujemy dane',
    paragraphs: [
      'Dane są przechowywane w usługach Google Firebase (Authentication i Cloud Firestore). Część danych (np. polubione filmy) zapisuje się także na Twoim telefonie.',
    ],
  },
  {
    title: '6. Twoje prawa',
    paragraphs: [
      'Możesz w każdej chwili zmienić imię, adres e-mail i hasło oraz usunąć konto w sekcji Ustawienia → Dane osobowe. Usunięcie konta kasuje Twoje konto i powiązane z nim dane. Masz też prawo poprosić o dostęp do swoich danych lub ich sprostowanie, pisząc na adres podany w punkcie 1, a także złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych.',
    ],
  },
  {
    title: '7. Zmiany',
    paragraphs: ['O istotnych zmianach tej polityki poinformujemy w aplikacji.'],
  },
];

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <BackButton />
      <Title title="Polityka prywatności" style={{fontSize: 18}}/>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.updated}>Ostatnia aktualizacja: {LAST_UPDATE}</Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.paragraphs?.map((text) => (
              <Text key={text} style={styles.paragraph}>
                {text}
              </Text>
            ))}

            {section.bullets?.map((text) => (
              <View key={text} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={[styles.paragraph, styles.bulletText]}>{text}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60,
  },

  updated: {
    marginBottom: 24,
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 14,
    opacity: 0.7,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    marginBottom: 10,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
  },

  paragraph: {
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.85,
  },

  bulletRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },

  bullet: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.85,
  },

  bulletText: {
    flex: 1,
  },
});