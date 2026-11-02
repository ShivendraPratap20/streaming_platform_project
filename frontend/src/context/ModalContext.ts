import { createContext, useContext } from "react";


const ModalContext = createContext(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

export { ModalContext, useModalContext };