import { type LucideIcon } from "lucide-react"

export type AccountType = "USER" | "CREATOR";

export type AuthorizationType = "EMAIL" | "GOOGLEAUTH";

interface TabButtons {
  buttonName: string,
  buttonIcon: LucideIcon,
  path: string,
};



interface MediaArtist {
  artistName: string;
  artistObjectID: string;
  artistUserID: string;
}

interface MediaDetails {
  format: string;
  duration: number;
  size: number;
  mimeType: string;
}

interface MediaDataType {
  _id: string;
  artist: MediaArtist;
  mediaDetails: MediaDetails;
  mediaName: string;
  mediaType: "video" | "audio";
  resourceType: string;
  publicID: string;
  cloudURL: string;
  fileStatus: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  variant: string[];
  createdAt: string;
  updatedAt: string;
  hlsURL: string;
  __v: number;
  playCount: number;
}

interface MediaCardContainerData {
  title: string,
  mediaCardData: MediaDataType[],
}

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlayBack: () => void;
};

type TimeRange = {
  start: number;
  end: number;
};

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  bufferedRanges: TimeRange[];
  onSeek: (time: number) => void;
};

interface QualityLevel {
  index: number;
  height: number;
  bitrate: number;
};

interface QualitySelectorProps {
  levels: QualityLevel[];
  selectedLevel: number;
  onSelect?: (level: number) => void;
};

interface ModalStateProps {
  modalName: string;
};

interface User {
  _id: string;

  userName: string;
  userID: string;
  email: string;

  phoneNumber?: number;
  profilePicture: string | null;

  accountType: AccountType;
  authorizationType: AuthorizationType;
  isEmailVerified: boolean;

  mediaFiles: {
    videoFiles: string[];
    audioFiles: string[];
  };

  mediaHistory: {
    mediaID: string;
  }[];

  description?: string;

  playlist: {
    _id?: string;
    playlistName: string;
    playlistItems: string[];
    totalDuration: number;
  }[];

  favorites: string[];

  createdAt: string;
  updatedAt: string;
}

export {
  type TabButtons,
  type MediaDataType,
  type MediaCardContainerData,
  type PlaybackControlsProps,
  type TimeRange,
  type ProgressBarProps,
  type QualityLevel,
  type QualitySelectorProps,
  type ModalStateProps,
  type User,
}
