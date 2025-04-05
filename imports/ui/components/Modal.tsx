import React from "react";

interface ModalProps {
    children: React.ReactNode;
    title: string;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({children, onClose, title}) => {
    return (
        <div
            className="fixed top-0 right-0 left-0 z-50 w-full h-dvh max-h-full bg-zinc-900 bg-opacity-30 flex justify-center items-center">
            <div className="relative bg-white rounded w-full max-w-3xl p-2">
                {/* Modal header*/}
                <div className="p-2 w-full inline-flex items-center justify-between">
                    <h2 className="text-lg">{title}</h2>
                    <button className="p-2" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                {/*Modal Content*/}
                <div className="p-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
