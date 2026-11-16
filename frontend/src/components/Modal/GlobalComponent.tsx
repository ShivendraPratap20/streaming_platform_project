import type { ModalStateProps } from '../../utils/interfaces';
import LoginModal from './LoginModal';
import UploadModal from './UploadModal';
import PlaylistModal from './PlaylistModal';
import UpdateModal from './UpdateModal';

const GlobalModal = ({ modalState, onClose, modalData }: { modalState: ModalStateProps | null; onClose: () => void, modalData: any }) => {


    switch (modalState?.modalName) {
        case 'login':
            return <LoginModal isOpen={true} onClose={onClose} />;
        case 'upload':
            return <UploadModal isOpen={true} onClose={onClose}/>
        case 'playlist':
            return <PlaylistModal isOpen={true} onClose={onClose} data={modalData}/>
        case 'update':
            return <UpdateModal isOpen={true} onClose={onClose} data={modalData}/>
        default:
            return null;
    }
};

export default GlobalModal;