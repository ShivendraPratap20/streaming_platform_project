import { useModalContext } from '../../context/ModalContext';
import type { ModalStateProps } from '../../utils/interfaces';
import LoginModal from './LoginModal';


const GlobalModal = ({ modalState }: { modalState: ModalStateProps | null }) => {

    switch (modalState?.modalName) {
        case 'login':
            return <LoginModal isOpen={true} onClose={() => {}} />;
        default:
            return null;
    }
};

export default GlobalModal;