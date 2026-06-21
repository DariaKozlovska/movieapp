import React, { ReactNode } from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../constants/colors';

type Props = {
  children: ReactNode;
};

export default function ScreenContainer({
  children,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});