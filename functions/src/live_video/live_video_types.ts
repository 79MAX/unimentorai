export interface VideoParticipant {
  userId: string;
  socketId: string;
  microphoneEnabled: boolean;
  cameraEnabled: boolean;
  screenSharing: boolean;
  joinedAt: number;
}

export interface VideoRoom {
  roomId: string;
  createdBy: string;
  participants: VideoParticipant[];
  createdAt: number;
}

export interface MediaEvent {
  type: string;
  roomId: string;
  userId: string;
  timestamp: number;
  payload?: any;
}