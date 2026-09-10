import {
  Text,
  StyleSheet
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

type Props = {
    title: string;
};

export default function Title({ title }: Props) {
  return (
    <Text style={styles.text}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 28,
    marginTop: 58,
    textAlign: 'center',
  },
});