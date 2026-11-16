
import { useEffect, useRef, useState } from "react";
import { Camera, Upload } from "lucide-react";

interface ProfilePictureProps {
    userName: string;
    imageSrc?: string;
    onImageChange: (file: File) => void;
}

const ProfilePicture = ({
    userName,
    imageSrc,
    onImageChange,
}: ProfilePictureProps): React.JSX.Element => {

    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState(imageSrc);

    useEffect(() => {
        setPreview(imageSrc);
    }, [imageSrc]);

    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image size should be less than 5MB.");
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);
        onImageChange(file);

        // Allow selecting the same file again
        e.target.value = "";
    };

    return (
        <div className="flex flex-col items-center gap-2 py-3">

            <div
                onClick={() => inputRef.current?.click()}
                className="group relative h-28 w-28 cursor-pointer
                overflow-hidden rounded-full border-4 border-purple-500/20
                bg-gray-200 shadow-md transition-all
                hover:border-purple-500"
            >

                {/* Profile Image */}
                {preview ? (
                    <img
                        src={preview}
                        alt={`${userName}'s profile`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center
                    justify-center bg-purple-100 text-purple-700">
                        <span className="text-4xl font-bold uppercase">
                            {userName?.trim()?.charAt(0) || "?"}
                        </span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex flex-col
                items-center justify-center gap-1
                bg-black/50 text-white opacity-0
                transition-opacity duration-200
                group-hover:opacity-100">

                    <Camera size={24} />
                    <span className="text-xs font-medium">
                        Change
                    </span>
                </div>

            </div>

            {/* <p className="text-sm font-medium text-text_primary">
                {userName}
            </p>

            <p className="flex items-center gap-1 text-xs text-text_label">
                <Upload size={13} />
                Click to upload profile picture
            </p> */}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />

        </div>
    );
};

export default ProfilePicture;
