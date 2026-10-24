import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';

import Title from '@/components/Text/title';
import HelpButton from '@/components/Button/HelpButton';
import SegmentedControl from '@/components/Selectors/SegmentedControl';

import CreateSessionView from '@/app/session/createSessionView';
import JoinSessionView from '@/app/session/joinSessionView';
import LobbyView from '@/app/session/LobbyView';
import WaitingRoomModal from '@/app/session/waitingRoomModal';

import { Colors } from '@/constants/colors';

type RoomMode = 'create' | 'join';

type ActiveRoom = {
  sessionId: string;
  role: 'admin' | 'guest';
};

const MODE_OPTIONS: { value: RoomMode; label: string }[] = [
  { value: 'create', label: 'Stwórz pokój' },
  { value: 'join', label: 'Dołącz do pokoju' },
];

export default function RoomsScreen() {
  const [mode, setMode] = useState<RoomMode>('create');
  // set after creating (admin) or joining (guest) a room
  const [room, setRoom] = useState<ActiveRoom | null>(null);

  // user left on purpose, or the game ended
  const leaveRoom = useCallback(() => setRoom(null), []);

  // time is up without a start (or the admin closed the room):
  // everybody lands on the "create room" screen
  const handleExpired = useCallback(() => {
    setRoom(null);
    setMode('create');

    Alert.alert(
      'Sesja zamknięta',
      'Czas na rozpoczęcie sesji minął albo administrator ją zamknął. Utwórz nowy pokój.',
    );
  }, []);

  const renderBody = () => {
    if (room?.role === 'admin') {
      return (
        <LobbyView
          sessionId={room.sessionId}
          onLeave={leaveRoom}
          onExpired={handleExpired}
        />
      );
    }

    return (
      <>
        {mode === 'create' ? (
          <CreateSessionView
            onCreated={(sessionId) => setRoom({ sessionId, role: 'admin' })}
          />
        ) : (
          <JoinSessionView
            onJoined={(sessionId) => setRoom({ sessionId, role: 'guest' })}
          />
        )}

        {room?.role === 'guest' && (
          <WaitingRoomModal
            sessionId={room.sessionId}
            onLeave={leaveRoom}
            onExpired={handleExpired}
          />
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <HelpButton />
      <Title title="Pokoje" />

      <SegmentedControl
        style={styles.switch}
        options={MODE_OPTIONS}
        value={mode}
        // the toggle is locked while you are inside a room
        onChange={(next) => !room && setMode(next)}
      />

      <View style={styles.body}>{renderBody()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  switch: { marginHorizontal: 32, marginTop: 16 },
  body: { flex: 1 },
});