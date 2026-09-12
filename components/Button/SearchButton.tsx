import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import { Colors } from '../../constants/colors';
import { router } from 'expo-router';
import React from 'react';

export function SearchButton() {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/search')}
    >
      <Image
        source={require('@/assets/images/Search.png')}
        style={styles.image}
      />
    </TouchableOpacity>
  );
} 

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 54,
    left: 20,

    width: 26,
    height: 36,

    justifyContent: 'center',
    alignItems: 'center',

    zIndex: 100,
  },

  image: {
    width: 32,
    height: 32,
  },
}); 
