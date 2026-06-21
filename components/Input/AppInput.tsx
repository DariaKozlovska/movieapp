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
};

export default function AppInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: Props) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.border}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={hidden}
      />

      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setHidden(!hidden)}
          style={styles.icon}
        >
          <Ionicons
            name={hidden ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color={Colors.border}
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
  },
});