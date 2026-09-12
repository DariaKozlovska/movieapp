import {Image, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {Colors} from '@/constants/colors';
import {Fonts} from '@/constants/fonts';

export function BackButton() {
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={{
        position: 'absolute',
        top: 54,
        left: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',

      }}>
      <Image
        source={require('@/assets/images/keyboard_arrow_left.png')}
        style={{width: 24, height: 24}}
      />
      <Text
        style={{
          color: Colors.text,
          fontSize: 18,
          fontFamily: Fonts.regular,
          marginLeft: -4,
        }}>
        Wróć
      </Text>
    </TouchableOpacity>
  );
};
