
import { useState } from "react";
import Hls from "hls.js";
import { type QualitySelectorProps } from "../../utils/interfaces";
import { handleQualityChange } from "../../utils/Audioutils";

interface PropsTypes extends QualitySelectorProps{
    setSelectedQuality?: () => void,
    HlsElement: Hls | null,
}

const QualitySelector = ({
    levels,
    selectedLevel,
    setSelectedQuality,
    HlsElement,
}: PropsTypes) => {

    const [isOpen, setIsOpen] = useState(false);

    const selectedLabel =
        selectedLevel === -1
            ? "Auto"
            : `${levels.find(level => level.index === selectedLevel)?.height ?? ""}p`;

    const sortedLevels = [...levels].sort(
        (a, b) => b.height - a.height
    );

    const handleSelect = (level: number) => {
        if(!HlsElement)
            return
        
        handleQualityChange(level, HlsElement, setSelectedQuality);
        setIsOpen(false);
    };

    return (
        <div className="relative">

            {/* Settings button */}
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
                className="flex items-center gap-2 px-3 py-2 text-sm
                text-white hover:bg-white/10 rounded-md transition"
            >
                <span>Quality</span>
                <span className="text-gray-400">{selectedLabel}</span>
            </button>

            {/* Quality menu */}
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2
                w-44 bg-gray-900 border border-gray-700
                rounded-lg shadow-xl overflow-hidden z-50">

                    <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700">
                        Video Quality
                    </div>

                    {/* Auto option */}
                    <button
                        type="button"
                        onClick={() => handleSelect(-1)}
                        className={`w-full flex justify-between items-center
                        px-3 py-2 text-sm hover:bg-white/10 transition
                        ${selectedLevel === -1 ? "text-indigo-400" : "text-white"}`}
                    >
                        Auto
                        {selectedLevel === -1 && <span>✓</span>}
                    </button>

                    {/* Available quality levels */}
                    {sortedLevels.map(level => (
                        <button
                            key={level.index}
                            type="button"
                            onClick={() => handleSelect(level.index)}
                            className={`w-full flex justify-between items-center
                            px-3 py-2 text-sm hover:bg-white/10 transition
                            ${selectedLevel === level.index
                                ? "text-indigo-400"
                                : "text-white"
                            }`}
                        >
                            {level.height} kbps

                            {selectedLevel === level.index && (
                                <span>✓</span>
                            )}
                        </button>
                    ))}

                </div>
            )}

        </div>
    );
};

export default QualitySelector;
