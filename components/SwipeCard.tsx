import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { getMovieTrailer } from '../api/tmdbApi';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.75;

interface Props {
  movie: {
    id: number;
    title: string;
    poster_path: string;
  };
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
  isNextCard?: boolean;
}

export default function SwipeCard({
  movie,
  onSwipeLeft,
  onSwipeRight,
  disabled = false,
  isNextCard = false,
}: Props) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;
  }, [movie.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => {
    if (isNextCard) return { opacity: 0 };

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, width * 0.25],
      [0, 0.6],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      backgroundColor:
        translateX.value > 0
          ? 'rgba(0,255,0,0.4)'
          : translateX.value < 0
          ? 'rgba(255,0,0,0.4)'
          : 'transparent',
      ...StyleSheet.absoluteFillObject,
    };
  });

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

  const openTrailer = async () => {
    try {
      const url = await getMovieTrailer(movie.id);
      if (!url) {
        Alert.alert('Brak zwiastuna');
        return;
      }
      Linking.openURL(url);
    } catch {
      Alert.alert('Błąd otwierania zwiastuna');
    }
  };

  return (
    <PanGestureHandler
      enabled={!disabled && !isNextCard}
      onGestureEvent={onGestureEvent}
      onEnded={onEnd}
      activeOffsetX={[-10, 10]}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.inner}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            style={styles.image}
          />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.gradient}
          />

          <View style={styles.bottom}>
            <Text style={styles.title}>{movie.title}</Text>
            <TouchableOpacity style={styles.button} onPress={openTrailer}>
              <Text style={styles.buttonText}>🎬 Zwiastun</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={overlayStyle} />

          {isNextCard && <View style={styles.inactive} />}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#000',
    elevation: 8,
  },
  inner: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '82%',
  },
  gradient: {
    position: 'absolute',
    bottom: '18%',
    width: '100%',
    height: '15%',
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    height: '18%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#e50914',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  inactive: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});