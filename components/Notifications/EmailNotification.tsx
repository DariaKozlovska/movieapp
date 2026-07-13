import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

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
  const opacity = useRef(new Animated.Value(0));
  const translateY = useRef(new Animated.Value(-20));

  useEffect(() => {
    if (!visible) {
      return;
    }

    Animated.parallel([
      Animated.timing(opacity.current, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY.current, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity.current, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY.current, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onHide]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        type === 'success' ? styles.success : styles.error,
        {
          opacity: opacity.current,
          transform: [{ translateY: translateY.current }],
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