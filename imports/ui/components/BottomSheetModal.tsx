import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";

export default function BottomSheetModal({
  children,
  title,
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 left-0 z-50 w-full h-dvh max-h-full bg-zinc-900 bg-opacity-30"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            key="modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, type: "tween", ease: [0.65, 0.05, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-4 z-99"
          >
            {/* header */}
            <div className="flex flex-row justify-between items-center mb-2">
              {/* title */}
              <h2 className="text-lg font-semibold text-zinc-800">{title}</h2>
              {/* close button */}
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
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root") || document.createElement("div#modal-root"), // Fallback in case modal-root is not found
  );
}
