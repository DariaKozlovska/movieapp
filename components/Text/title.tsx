import {
  Text,
  StyleSheet
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

type Props = {
    title: string;
    style?: object;
};

export default function Title({ title, style }: Props) {
  return (
    <Text style={[styles.text, style]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.text,
    fontFamily: Fonts.bold,
    fontSize: 28,
    marginTop: 60,
    textAlign: 'center',
  },
});