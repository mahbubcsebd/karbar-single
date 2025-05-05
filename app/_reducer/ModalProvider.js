import { useState } from "react";
import { ModalContext } from "../_context/ModalContext";

export const ModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ModalContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </ModalContext.Provider>
    );
};

export default ModalContext;
