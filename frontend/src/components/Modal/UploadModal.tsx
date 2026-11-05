import React from "react";
import { Upload } from "lucide-react";


const UploadModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen)
        return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center  p-2 sm:p-4"
            onClick={onClose}
        >
            <div className="w-[50%] h-[50%] flex flex-col justify-center items-center gap-4 bg-dark_blue rounded-2xl p-6">
                <p className="text-2xl text-text_primary">Start uploading your next contert!</p>
                <button className="bg-custom_purple text-lg text-bold text-text_primary p-4 flex flex-row items-center justify-center rounded-xl"
                    onClick={() => {console.log()}}
                >
                    <span><Upload size={30} color="var(--color-text_primary)" /></span>
                    Upload Media
                </button>
            </div>
        </div>
    )
};

export default UploadModal