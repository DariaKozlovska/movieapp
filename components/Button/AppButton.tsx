import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'success';
  style?: ViewStyle;
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  style,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor:
            variant === 'primary'
              ? Colors.red
              : Colors.green,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    minHeight: 56,

    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    paddingHorizontal: 16,
  },

  text: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,

    textAlign: 'center',

    flexShrink: 1, 
  },
});