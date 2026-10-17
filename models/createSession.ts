import { useState } from 'react';

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

  type GenerateSessionResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      message: string;
      data: {
        participantCount: number;
        participantNames: string[];
      };
    };

    const generateSession = (): GenerateSessionResult => {
    const creatorName = participantNames[0]?.trim();

    if (!creatorName) {
        return {
        success: false,
        message: 'Wpisz swoje imię, aby utworzyć sesję.',
        };
    }

    return {
        success: true,
        message: 'Dane sesji zostały przygotowane.',
        data: {
        participantCount,
        participantNames: participantNames.map((name) => name.trim()),
        },
    };
    };

  return {
    participantCount,
    participantNames,
    updateParticipantCount,
    updateParticipantName,
    generateSession,
  };
}