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
import { Colors } from '@/constants/colors';
import AppButton from './Button/AppButton';

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
  }, [movie.id, translateX]);

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
        ? Colors.green
        : translateX.value < 0
        ? Colors.red
        : 'transparent';

    return {
      ...StyleSheet.absoluteFill,
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

          <Animated.View style={swipeOverlayStyle} />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.gradientOverlay}
          />

          <View style={styles.bottomBlock}>
            <Text style={styles.title}>{movie.title}</Text>

            <AppButton title={'Obejrzyj zwiastun'} onPress={openTrailer} style={styles.trailerButton} />
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
    backgroundColor: Colors.background,
    elevation: 8,
  },
  cardInner: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  inactiveOverlay: {
    ...StyleSheet.absoluteFill,
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
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  trailerButton: {
    width: '90%',
    marginBottom: 14,
  },
  trailerText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});