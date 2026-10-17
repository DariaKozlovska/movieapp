import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export default function Counter({
  value,
  min = 2,
  max = 6,
  onChange,
}: Props) {
  const decrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const isMin = value <= min;
  const isMax = value >= max;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isMin && styles.disabledButton,
        ]}
        onPress={decrease}
        disabled={isMin}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel="-"
      >
        <Ionicons
          name="remove"
          size={20}
          color={Colors.text}
        />
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {value} 
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          isMax && styles.disabledButton,
        ]}
        onPress={increase}
        disabled={isMax}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel="+"
      >
        <Ionicons
          name="add"
          size={20}
          color={Colors.text}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    minWidth: 100,
    height: 40,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 8,
    },

  button: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  disabledButton: {
    opacity: 0.35,
  },

  valueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  value: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },
});