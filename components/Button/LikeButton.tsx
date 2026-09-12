import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useLikedMovies } from '@/contexts/LikedMoviesContext';
import { Movie } from '@/models/Movie';

interface LikeButtonProps {
  movie: Movie;
}

const LikeButton: React.FC<LikeButtonProps> = ({ movie }) => {
  const { likedMovies, addLikedMovie, removeLikedMovie } = useLikedMovies();
  const isLiked = likedMovies.some((m) => m.id === movie.id);

  const handlePress = () => {
    if (isLiked) {
      removeLikedMovie(movie.id);
    } else {
      addLikedMovie(movie);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Image
        source={
          isLiked
            ? require('@/assets/images/heart_filled.png')
            : require('@/assets/images/heart_outline.png')
        }
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 64,
    height: 64,
  },
});

export default LikeButton;