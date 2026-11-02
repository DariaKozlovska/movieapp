import { Alert, Linking } from 'react-native';
import { getMovieTrailer } from '@/api/tmdbApi';

export async function openMovieTrailer(movie: {
  id: number;
  trailer_url?: string;
}) {
  try {
    const url = movie.trailer_url ?? (await getMovieTrailer(movie.id));

    if (!url) {
      Alert.alert('Brak zwiastuna', 'Ten film nie ma dostępnego zwiastuna.');
      return;
    }

    await Linking.openURL(url);
  } catch {
    Alert.alert('Błąd', 'Nie udało się otworzyć zwiastuna.');
  }
}