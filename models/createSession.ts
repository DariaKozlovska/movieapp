import { useState } from 'react';

import { auth } from '@/config/firebase';
import { createSession } from '@/services/sessionService';
import type { ServiceResult } from '@/types/session';

type GenerateSessionResult = ServiceResult<{
  sessionId: string;
  code: string;
}>;

export default function useCreateSessionViewModel() {
  const [participantCount, setParticipantCount] = useState(2);

  const [participantNames, setParticipantNames] = useState<string[]>([
    '',
    '',
  ]);

  const updateParticipantCount = (count: number) => {
    setParticipantCount(count);

    setParticipantNames((previousNames) =>
      Array.from(
        { length: count },
        (_, index) => previousNames[index] ?? '',
      ),
    );
  };

  const updateParticipantName = (index: number, name: string) => {
    setParticipantNames((previousNames) =>
      previousNames.map((previousName, currentIndex) =>
        currentIndex === index ? name : previousName,
      ),
    );
  };

  const generateSession = async (
    genre: number | null,
  ): Promise<GenerateSessionResult> => {
    const creatorName = participantNames[0]?.trim();

    if (!creatorName) {
      return {
        success: false,
        message: 'Wpisz swoje imię, aby utworzyć sesję.',
      };
    }

    const user = auth.currentUser;

    if (!user) {
      return {
        success: false,
        message: 'Musisz być zalogowany, aby utworzyć sesję.',
      };
    }

    const invitedNames = participantNames
      .slice(1, participantCount)
      .map((name) => name.trim())
      .filter(Boolean);

    return createSession({
      adminId: user.uid,
      adminName: creatorName,
      maxParticipants: participantCount,
      genre,
      invitedNames,
    });
  };

  return {
    participantCount,
    participantNames,
    updateParticipantCount,
    updateParticipantName,
    generateSession,
  };
}