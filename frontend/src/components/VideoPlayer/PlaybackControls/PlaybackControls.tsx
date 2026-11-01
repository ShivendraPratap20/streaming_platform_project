import React from 'react';
import { Pause, Play } from 'lucide-react';
import { type PlaybackControlsProps } from '../../../utils/interfaces/index';
import { formatTime } from '../../../utils';

const PlaybackControls = ({ isPlaying, currentTime, duration, onTogglePlayBack }: PlaybackControlsProps): React.JSX.Element => {
    return (
        <div className="playback-controls flex flex-row gap-4 items-center">

            <button
                type="button"
                onClick={onTogglePlayBack}
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