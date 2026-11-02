import { Image, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

type BackButtonProps = {
  fallbackRoute?: '/(tabs)/home';
};

export function BackButton({ fallbackRoute }: BackButtonProps) {
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else if (fallbackRoute) {
      router.replace(fallbackRoute);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <TouchableOpacity
      onPress={handleBack}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Wróć do poprzedniego ekranu"
      style={{
        position: 'absolute',
        top: 54,
        left: 20,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}
    >
      <Image
        source={require('@/assets/images/keyboard_arrow_left.png')}
        style={{ width: 24, height: 24 }}
      />

      <Text
        style={{
          color: Colors.text,
          fontSize: 18,
          fontFamily: Fonts.regular,
          marginLeft: -4,
        }}
      >
        Wróć
      </Text>
    </TouchableOpacity>
  );
}