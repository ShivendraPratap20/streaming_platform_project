import React, { useRef, useState } from "react";
import { type ProgressBarProps } from "../../utils/interfaces";
import { handleSeek } from "../../utils/Audioutils";

interface PropsType extends ProgressBarProps {
    MediaElement: HTMLVideoElement | HTMLAudioElement | null,
};

const ProgressBar = ({
    currentTime,
    duration,
    bufferedRanges,
    MediaElement,
}: PropsType) => {

    const progressRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [previewTime, setPreviewTime] = useState(0);

    const getPercentage = (time: number) => {
        if (!Number.isFinite(duration) || duration <= 0) {
            return 0;
        }

        return Math.min(
            Math.max((time / duration) * 100, 0),
            100
        );
    };

    const getTimeFromPointer = (clientX: number) => {
        const progressElement = progressRef.current;

        if (!progressElement || !Number.isFinite(duration) || duration <= 0) {
            return 0;
        }

        const rect = progressElement.getBoundingClientRect();

        const offsetX = clientX - rect.left;

        const percentage = Math.min(
            Math.max(offsetX / rect.width, 0),
            1
        );

        return percentage * duration;
    };

    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        if (!Number.isFinite(duration) || duration <= 0) return;

        event.currentTarget.setPointerCapture(event.pointerId);

        const targetTime = getTimeFromPointer(event.clientX);

        setIsDragging(true);
        setPreviewTime(targetTime);
    };

    const handlePointerMove = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        if (!isDragging) return;

        const targetTime = getTimeFromPointer(event.clientX);

        setPreviewTime(targetTime);
    };

    const handlePointerUp = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        if (!isDragging) return;

        const targetTime = getTimeFromPointer(event.clientX);

        handleSeek(MediaElement, targetTime);

        setIsDragging(false);
    };

    const handlePointerCancel = () => {
        setIsDragging(false);
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (!Number.isFinite(duration) || duration <= 0) return;

        let targetTime = currentTime;

        switch (event.key) {
            case "ArrowRight":
                targetTime += 5;
                break;

            case "ArrowLeft":
                targetTime -= 5;
                break;

            case "Home":
                targetTime = 0;
                break;

            case "End":
                targetTime = duration;
                break;

            default:
                return;
        }

        event.preventDefault();

        handleSeek(MediaElement, Math.min(Math.max(targetTime, 0), duration));
    };

    const displayedTime = isDragging ? previewTime : currentTime;

    const playedPercentage = getPercentage(displayedTime);

    return (
        <div
            ref={progressRef}
            className="relative group w-full h-6 flex items-center cursor-pointer touch-none select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onKeyDown={handleKeyDown}
            role="slider"
            tabIndex={0}
            aria-label="Video progress"
            aria-valuemin={0}
            aria-valuemax={Number.isFinite(duration) ? duration : 0}
            aria-valuenow={displayedTime}
        >

            <div className="relative w-full h-[5px] group-hover:h-[7px] bg-gray-700 rounded-full transition-all duration-150 overflow-hidden">

                {bufferedRanges.map((range, index) => {
                    const left = getPercentage(range.start);
                    const right = getPercentage(range.end);

                    return (
                        <div
                            key={index}
                            className="absolute top-0 h-full bg-gray-400"
                            style={{
                                left: `${left}%`,
                                width: `${Math.max(right - left, 0)}%`,
                            }}
                        />
                    );
                })}

                <div
                    className="absolute top-0 left-0 h-full bg-indigo-400 rounded-full z-10"
                    style={{
                        width: `${playedPercentage}%`,
                    }}
                />
            </div>

            <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20
                w-3 h-3 rounded-full bg-white shadow-md
                opacity-0 group-hover:opacity-100
                group-active:opacity-100 transition-opacity"
                style={{
                    left: `${playedPercentage}%`,
                }}
            />

        </div>
    );
};

export default ProgressBar;

