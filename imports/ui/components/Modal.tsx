import React from "react";

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({children, onClose}) => {
    return (
        <div className="modal">
            <button className="w-64 h-64" onClick={onClose}>
                X
            </button>
            <div className="modal-content">
                {children}
            </div>
        </div>
    );
};

export default Modal;
