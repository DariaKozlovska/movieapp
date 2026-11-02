import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

type Props = {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  rightIconAccessibilityLabel?: string;
};

export default function AppInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  rightIcon,
  onRightIconPress,
  rightIconAccessibilityLabel,
}: Props) {
  const [hidden, setHidden] = useState(secureTextEntry);

  const iconName = secureTextEntry
    ? hidden
      ? 'eye-off-outline'
      : 'eye-outline'
    : rightIcon;

  const handleIconPress = () => {
    if (secureTextEntry) {
      setHidden(!hidden);
    } else {
      onRightIconPress?.();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.border}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={hidden}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />

      {iconName && (
        <TouchableOpacity
          onPress={handleIconPress}
          style={styles.icon}
          disabled={!secureTextEntry && !onRightIconPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={
            rightIconAccessibilityLabel ?? 'Przycisk pola tekstowego'
          }
        >
          <Ionicons
            name={iconName}
            size={22}
            color={Colors.text}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    minHeight: 56,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: Colors.placeholder,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  input: {
    flex: 1,
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 20,
  },

  icon: {
    marginLeft: 10,
    padding: 4,
  },
});