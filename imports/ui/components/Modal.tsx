import React, { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, isOpen, title }) => {
  useEffect(() => {
    const closeOnEscapePressed = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", closeOnEscapePressed);
    return () => window.removeEventListener("keydown", closeOnEscapePressed);
  }, []);

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
            className="relative bg-white rounded-lg w-full max-w-2xl m-4"
          >
            {/* Modal header*/}
            <div className="p-4 w-full inline-flex items-center bg-white-100 border-b border-gray-200 shadow-xs">
              <h2 className="text-lg">{title}</h2>
            </div>
            {/*Modal Content*/}
            <div key="modal-children" className="p-4 w-full h-full bg-gray-50 rounded-lg">
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
