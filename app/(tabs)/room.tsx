import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import Title from '@/components/Text/title';
import HelpButton from '@/components/Button/HelpButton';
import SegmentedControl from '@/components/Selectors/SegmentedControl';

import CreateSessionView from '@/app/session/createSessionView';
import JoinSessionView from '@/app/session/joinSessionView';

import { Colors } from '@/constants/colors';

type RoomMode = 'create' | 'join';

const MODE_OPTIONS: { value: RoomMode; label: string }[] = [
  { value: 'create', label: 'Stwórz pokój' },
  { value: 'join', label: 'Dołącz do pokoju' },
];

export default function RoomsScreen() {
  const [mode, setMode] = useState<RoomMode>('create');

  return (
    <View style={styles.container}>
      <HelpButton />
      <Title title="Pokoje" />

      <SegmentedControl
        style={styles.switch}
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
      />

      <View style={styles.body}>
        {mode === 'create' ? <CreateSessionView /> : <JoinSessionView />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  switch: {
    marginHorizontal: 32,
    marginTop: 16,
  },

  body: {
    flex: 1,
  },
});