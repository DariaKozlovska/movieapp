import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

export interface SelectorOption<T = number> {
  id: T | null;
  name: string;
}

type Props<T> = {
  options: SelectorOption<T>[];
  selectedOption: T | null;
  onSelectOption: (optionId: T | null) => void;
  placeholder?: string;

  // Style całego komponentu
  style?: ViewStyle;

  // Style poszczególnych elementów
  selectorStyle?: ViewStyle;
  selectorTextStyle?: TextStyle;
  dropdownStyle?: ViewStyle;
  optionStyle?: ViewStyle;
  optionTextStyle?: TextStyle;
};

export default function Selector<T>({
  options,
  selectedOption,
  onSelectOption,
  placeholder = 'Wybierz kategorię',
  style,
  selectorStyle,
  selectorTextStyle,
  dropdownStyle,
  optionStyle,
  optionTextStyle,
}: Props<T>) {
  const [opened, setOpened] = useState(false);

  const selected =
    options.find((option) => option.id === selectedOption)?.name ||
    placeholder;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.selector, selectorStyle]}
        activeOpacity={1}
        onPress={() => setOpened((prev) => !prev)}
      >
        <Text style={[styles.selectorText, selectorTextStyle]}>
          {selected}
        </Text>

        <Ionicons
          name={opened ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.text}
        />
      </TouchableOpacity>

      {opened && (
        <View style={[styles.dropdown, dropdownStyle]}>
          {options.map((option) => (
            <TouchableOpacity
              key={String(option.id)}
              style={[styles.option, optionStyle]}
              activeOpacity={1}
              onPress={() => {
                onSelectOption(option.id);
                setOpened(false);
              }}
            >
              <Text style={[styles.optionText, optionTextStyle]}>
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 150,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1000,
    marginTop: 14,
  },

  selector: {
    minWidth: 150,
    height: 40,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    paddingHorizontal: 12,
  },

  selectorText: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: Fonts.bold,
  },

  dropdown: {
    position: 'absolute',
    top: 48,
    minWidth: 150,
    paddingHorizontal: 12,
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    zIndex: 9999,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  optionText: {
    color: Colors.text,
    textAlign: 'center',
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
});