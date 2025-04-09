import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, isOpen, title }) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={"modal-backdrop"}
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(2px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed top-0 right-0 left-0 z-50 w-full h-dvh max-h-full bg-zinc-900 bg-opacity-30 flex justify-center items-center"
        >
          <motion.div
            key={"modal-content"}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative bg-white rounded-lg w-full max-w-4xl p-2 m-4"
          >
            {/* Modal header*/}
            <div className="p-2 w-full inline-flex items-center justify-between">
              <h2 className="text-lg">{title}</h2>
              <button className="p-2" onClick={onClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/*Modal Content*/}
            <div key="modal-children" className="p-2">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root") || document.createElement("div#modal-root"), // Fallback in case modal-root is not found
  );
};

export default Modal;
