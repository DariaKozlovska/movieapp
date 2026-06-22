import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type Props = {
  visible: boolean;
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onHide?: () => void;
};

export default function Notification({
  visible,
  message,
  type = 'success',
  duration = 2500,
  onHide,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: any;

    if (visible) {
      setShow(true);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // 🔥 AUTO HIDE TUTAJ (JEDYNE MIEJSCE)
      timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -20,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShow(false);
          onHide?.();
        });
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, message]);

  if (!show) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        type === 'success' ? styles.success : styles.error,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 12,
    zIndex: 999,
    elevation: 10,
  },

  success: {
    backgroundColor: Colors.green,
  },

  error: {
    backgroundColor: Colors.red,
  },

  text: {
    color: Colors.text,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: Fonts.bold,
  },
});