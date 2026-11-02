import { useState } from 'react';
import { type ModalStateProps } from '../utils/interfaces';
import { ModalContext } from '../context/ModalContext';
import GlobalModal from '../components/Modal/GlobalComponent';

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modalState, setModalState] = useState<ModalStateProps | null>(null);

    const openModal = (modalName: string) => {
        if (modalState) {
            setModalState(null);
        }
        setModalState({ modalName });
    };

    const closeModal = () => {
        setModalState(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <GlobalModal modalState={modalState} />
        </ModalContext.Provider>
    );
};

