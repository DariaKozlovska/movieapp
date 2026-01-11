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
import { useRouter } from 'expo-router'; 
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
      [0, width * 0.25],
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
      backgroundColor: color,
      opacity,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 20,
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
        Alert.alert('Brak zwiastuna', 'Ten film nie ma dostępnego zwiastuna.');
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert('Błąd', 'Nie udało się otworzyć zwiastuna.');
    }
  };

  const goToDetails = () => {
    router.push(`/movie/${movie.id}`);
  };

  return (
    <PanGestureHandler
      enabled={!disabled && !isNextCard}
      activeOffsetX={[-10, 10]}
      onGestureEvent={onGestureEvent}
      onEnded={onEnd}
    >
      <Animated.View style={[styles.card, animatedStyle]}>
        <Pressable
          style={styles.cardInner}
          onPress={goToDetails} 
        >
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

          {isNextCard && <View style={styles.inactiveOverlay} />}
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
    elevation: 8, // Android shadow
    shadowColor: '#cac6c6ff', // iOS shadow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  trailerButton: {
    backgroundColor: '#e50914',
    paddingVertical: 12,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  trailerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});