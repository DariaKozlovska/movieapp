import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  Pressable,
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
import { useRouter } from 'expo-router';
import { getMovieTrailer } from '../api/tmdbApi';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = height * 0.75;
const SWIPE_THRESHOLD = width * 0.25;

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
  const router = useRouter();
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;
  }, [movie.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const swipeOverlayStyle = useAnimatedStyle(() => {
    if (isNextCard) return { opacity: 0 };

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD],
      [0, 0.6],
      Extrapolate.CLAMP
    );

    const color =
      translateX.value > 0
        ? 'rgba(0,255,0,0.6)'
        : translateX.value < 0
        ? 'rgba(255,0,0,0.6)'
        : 'transparent';

    return {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: color,
      opacity,
      borderRadius: 20,
    };
  });

  const onGestureEvent = (event: any) => {
    if (disabled) return;
    translateX.value = event.nativeEvent.translationX;
  };

  const onEnd = () => {
    if (disabled) return;

    if (translateX.value > SWIPE_THRESHOLD) {
      translateX.value = withSpring(width, {}, () => {
        onSwipeRight && runOnJS(onSwipeRight)();
      });
    } else if (translateX.value < -SWIPE_THRESHOLD) {
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
      await Linking.openURL(url);
    } catch {
      Alert.alert('Błąd', 'Nie udało się otworzyć zwiastuna.');
    }
  };

  return (
    <PanGestureHandler
      enabled={!disabled && !isNextCard}
      activeOffsetX={[-15, 15]}
      onGestureEvent={onGestureEvent}
      onEnded={onEnd}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <Pressable
          style={styles.cardInner}
          onPress={() => router.push(`/movie/${movie.id}`)}
        >
          {isNextCard && <View style={styles.inactiveOverlay} />}

          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            style={styles.image}
          />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.gradientOverlay}
          />

          <Animated.View style={swipeOverlayStyle} />

          <View style={styles.bottomBlock}>
            <Text style={styles.title}>{movie.title}</Text>

            <TouchableOpacity
              style={styles.trailerButton}
              onPress={openTrailer}
              activeOpacity={0.8}
            >
              <Text style={styles.trailerText}> Obejrzyj zwiastun</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
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
    alignSelf: 'center',
    backgroundColor: '#000',
    elevation: 8,
  },
  cardInner: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  inactiveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  image: {
    width: '100%',
    height: '82%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: '18%',
    width: '100%',
    height: '15%',
  },
  bottomBlock: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '18%',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  trailerButton: {
    backgroundColor: '#e50914',
    paddingVertical: 10,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  trailerText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});