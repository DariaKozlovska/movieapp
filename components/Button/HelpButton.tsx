import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function HelpButton() {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/help')}
    >
      <Text style={styles.text}>?</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 20,

    width: 36,
    height: 36,

    borderRadius: 18,

    borderWidth: 2,
    borderColor: Colors.text,

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 100,
  },

  text: {
    color: Colors.text,
    fontWeight: '700',
    fontSize: 18,
  },
});