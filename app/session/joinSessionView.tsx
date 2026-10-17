import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

export default function JoinSessionView() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ten ekran jest w trakcie tworzenia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  text: {
    color: Colors.text,
    fontFamily: Fonts.regular,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.75,
  },
});