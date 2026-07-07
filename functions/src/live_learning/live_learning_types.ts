export interface LiveParticipant {
  userId: string;
  role: "MENTOR" | "STUDENT" | "ADMIN";
  displayName: string;
  language?: string;
  joinedAt: number;
}

export interface LiveSession {
  sessionId: string;
  mentorId: string;
  title: string;
  startedAt: number;
  secureToken: string;
  participants: LiveParticipant[];
  recordingEnabled: boolean;
  translationEnabled: boolean;
}

export interface WebinarEvent {
  type: string;
  sessionId: string;
  timestamp: number;
  payload?: any;
}