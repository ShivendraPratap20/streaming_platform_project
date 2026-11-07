import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import api from "../../api/axios";

const UploadModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen)
        return null;

    const [selectedFile, setSelectedFile] = useState<File | null>();
    const [progress, setProgress] = useState<number>(0);

    const { mutate, isPending, isSuccess, isError, error, data } = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("media", file);
            formData.append("mediaType", "video");
            const response = await api.post('/media/upload', formData,
                {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setProgress(percentage)
                        }
                    },
                }
            );
            return response;
        },
        onSuccess: (data) => {
            console.log("Upload successful:", data);
        },

        onError: (error) => {
            console.error("Upload failed:", error);
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log(file)
            setSelectedFile(file);
        }
    };

    const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>, file: File) => {
        if(!file)
            return

        const renamedFile = new File(
            [file],
            e.target.value,
            { type: file.type}
        );

        setSelectedFile(renamedFile);
    };

    const handleUpload = () => {
        if (!selectedFile) return
        mutate(selectedFile)
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center bg-black/70 backdrop-blur-sm justify-center  p-2 sm:p-4"
            onClick={onClose}
        >
            <div className="w-[50%] h-[50%] flex flex-col justify-center items-center gap-4 bg-dark_blue rounded-2xl p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {
                    selectedFile ? (
                        <>
                            <div className="flex flex-row w-[100%] p-4 gap-4 items-center">
                                <label htmlFor="fileName" className="text text_label text-lg text-text_label">Media Name:</label>
                                <input
                                    className="text-xl text-text_primary"
                                    type="text"
                                    value={selectedFile.name}
                                    onChange={()=>{handleFileNameChange(event, selectedFile)}}
                                />
                            </div>
                            <div className="flex flex-row w-[100%] p-4 gap-4 items-center">
                                <p className="text text_label text-lg text-text_label">Media Size:</p>
                                <p className="text text_label text-xl text-text_primary">
                                    {selectedFile.size}
                                </p>
                            </div>
                            <div className="flex flex-row w-[100%] p-4 gap-4 items-center">
                                <p className="text text_label text-lg text-text_label">Media type:</p>
                                <p className="text text_label text-xl text-text_primary text-bold">
                                    {selectedFile.type}
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-2xl text-text_primary">Start uploading your next contert!</p>
                            <label className="p-6 text-text_label text-lg border-2 border-solid border-surface_1 rounded-xl">
                                <input
                                    type="file"
                                    accept="video/*,audio/*"
                                    onChange={handleFileChange}
                                    hidden
                                />
                                Choose your media to upload
                            </label>
                        </>
                    )
                }
                {
                    isPending ? (

                        <div className="w-[100%] h-5 bg-gray-100 rounded-2xl">
                            <div className={`w-[${progress}%] h-[100%] bg-green-400 rounded-2xl`}></div>
                        </div>
                    ) : (
                        <button className={`${selectedFile ? 'bg-custom_purple' : 'bg-gray-400'} text-lg text-bold text-text_primary p-4 flex flex-row items-center justify-center rounded-xl`}
                            onClick={handleUpload}
                            disabled={!selectedFile}
                        >
                            <span><Upload size={30} color="var(--color-text_primary)" /></span>
                            Upload Media
                        </button>
                    )
                }
                {isSuccess && (
                    <p className="text-green-300">File uploaded successfully!</p>
                )}

                {isError && (
                    <p className="text-red-300">
                        Upload failed: {error.message}
                    </p>
                )}
            </div >
        </div >
    )
};

export default UploadModal