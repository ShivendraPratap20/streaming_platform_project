import type { ModalStateProps } from '../../utils/interfaces';
import LoginModal from './LoginModal';
import UploadModal from './UploadModal';
import PlaylistModal from './PlaylistModal';

const GlobalModal = ({ modalState, onClose }: { modalState: ModalStateProps | null; onClose: () => void }) => {

    switch (modalState?.modalName) {
        case 'login':
            return <LoginModal isOpen={true} onClose={onClose} />;
        case 'upload':
            return <UploadModal isOpen={true} onClose={onClose}/>
        case 'playlist':
            return <PlaylistModal isOpen={true} onClose={onClose}/>
        default:
            return null;
    }
};

export default GlobalModal;