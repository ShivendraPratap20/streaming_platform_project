import { type LucideIcon } from "lucide-react"

interface TabButtons {
  buttonName: string,
  buttonIcon: LucideIcon
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
    onSelect: (level: number) => void;
};

export {
  type TabButtons,
  type MediaDataType,
  type MediaCardContainerData,
  type PlaybackControlsProps,
  type TimeRange,
  type ProgressBarProps,
  type QualityLevel,
  type QualitySelectorProps,
}
