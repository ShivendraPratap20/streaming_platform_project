


const PlaylistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }): React.JSX.Element | null => {
    if(!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center
            bg-black/70 backdrop-blur-sm p-2 sm:p-4"
            onClick={onClose}
        ></div>
    )
};

export default PlaylistModal;