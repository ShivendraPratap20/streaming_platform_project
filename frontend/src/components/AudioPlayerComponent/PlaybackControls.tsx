import React from 'react';
import { Pause, Play } from 'lucide-react';
import { handleTogglePlayback } from '../../utils/Audioutils';
import { formatTime } from '../../utils';

interface PlaybackControlsProps {
    isPlaying: boolean,
    currentTime: number,
    duration: number,
    mediaElement: HTMLVideoElement | HTMLAudioElement | null,
}

const PlaybackControls = ({ isPlaying, currentTime, duration, mediaElement }: PlaybackControlsProps): React.JSX.Element => {
    return (
        <div className="playback-controls flex flex-row gap-4 items-center">

            <button
                type="button"
                onClick={() => handleTogglePlayback(mediaElement)}
                aria-label={isPlaying ? "Pause video" : "Play video"}
            >
                {isPlaying ? <Pause size={40} color='var(--color-text_label)'/> : <Play size={40} color='var(--color-text_label)' />}
            </button>

            <div className="playback-controls__time text-text_primary text-sm sm:text-base">
                <span>{formatTime(currentTime)}</span>
                <span> / </span>
                <span>{formatTime(duration)}</span>
            </div>

        </div>
    );
};

export default PlaybackControls;