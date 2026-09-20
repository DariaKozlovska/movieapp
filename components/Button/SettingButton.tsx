import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
    Image,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function SettingButton({
  title,
  onPress,
  style,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        style,
      ]}
      onPress={onPress}
    >
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.text}>
        {title}
      </Text>
      <Image
        source={require('@/assets/images/keyboard_arrow_left.png')}
        style={{ width: 24, height: 24, tintColor: Colors.text, transform: [{ rotate: '180deg' }] }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    minHeight: 56,

    borderRadius: 14,

    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    width: '100%',
    paddingHorizontal: 24,

    backgroundColor: Colors.placeholder,
    borderColor: Colors.border,
    borderWidth: 1,
    marginBottom: 24,
  },

  text: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,

    textAlign: 'left',

    flexShrink: 1, 
  },
});