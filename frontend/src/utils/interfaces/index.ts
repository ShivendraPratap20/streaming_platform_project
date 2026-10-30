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

interface MediaCardContainerData{
    title: string, 
    mediaCardData: MediaDataType[],
}

export {
    type TabButtons,
    type MediaDataType,
    type MediaCardContainerData,
}
