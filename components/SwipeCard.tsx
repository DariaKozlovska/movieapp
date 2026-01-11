import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

interface Props {
  movie: {
    id: number;
    title: string;
    poster_path: string;
  };
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
}

export default function SwipeCard({
  movie,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
}: Props) {
  const translateX = useSharedValue(0);
  useEffect(() => {
    translateX.value = 0;
  }, [movie.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const onGestureEvent = (event: any) => {
    if (disabled) return;
    translateX.value = event.nativeEvent.translationX;
  };

  const onEnd = () => {
    if (disabled) return;

    if (translateX.value > width * 0.25) {
      translateX.value = withSpring(width, {}, () => {
        onSwipeRight && runOnJS(onSwipeRight)();
      });
    } else if (translateX.value < -width * 0.25) {
      translateX.value = withSpring(-width, {}, () => {
        onSwipeLeft && runOnJS(onSwipeLeft)();
      });
    } else {
      translateX.value = withSpring(0);
    }
  };

  return (
    <PanGestureHandler
      enabled={!disabled}
      onGestureEvent={onGestureEvent}
      onEnded={onEnd}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }}
          style={styles.image}
        />
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute', // 🔥 KLUCZ
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 12,
  },
});