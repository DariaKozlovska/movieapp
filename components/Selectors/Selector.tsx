import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

export interface SelectorOption {
  id: number | null;
  name: string;
}

type Props = {
  options: SelectorOption[];
  selectedOption: number | string | null;
  onSelectOption: (optionId: number | null) => void;
  placeholder?: string;
};

export default function Selector({
  options,
  selectedOption,
  onSelectOption,
  placeholder = 'Wybierz kategorię',
}: Props) {
  const [opened, setOpened] = useState(false);

  const selected =
    options.find((option) => option.id === selectedOption)?.name ||
    placeholder;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        activeOpacity={1}
        onPress={() => setOpened((prev) => !prev)}
      >
        <Text style={styles.selectorText}>
          {selected}
        </Text>

        <Ionicons
          name={opened ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.text}
        />
      </TouchableOpacity>

      {opened && (
        <View style={styles.dropdown}>
          {options.map((option) => (
            <TouchableOpacity
              key={String(option.id)}
              style={styles.option}
              activeOpacity={1}
              onPress={() => {
                onSelectOption(option.id);
                setOpened(false);
              }}
            >
              <Text style={styles.optionText}>
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
    width: 150,
    alignItems: 'center',
    position: 'relative',
    zIndex: 1000,
    marginTop: 14,
  },

  selector: {
    width: 150,
    height: 40,

    borderRadius: 12,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: Colors.cardBackground,

    borderWidth: 1,
    borderColor: Colors.border,

    gap: 8,
  },

  selectorText: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: Fonts.bold,
  },

  dropdown: {
    position: 'absolute',
    top: 48,

    width: 150,

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