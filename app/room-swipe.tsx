import React from 'react';
import { useLocalSearchParams } from 'expo-router';

import SwipeView from '@/app/session/swipeView';

export default function RoomSwipeRoute() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();

  return <SwipeView sessionId={sessionId} />;
}