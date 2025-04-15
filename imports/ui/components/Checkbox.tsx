import React from "react";
import { motion, AnimatePresence } from "motion/react";

type CheckboxProps = {
  checked?: boolean;
  label?: string;
  id?: string;
  onChange: (checked: boolean) => void;
};

export default function Checkbox(props: CheckboxProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.onChange(e.target.checked);
  }

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        id={props.id}
        checked={props.checked}
        onChange={(event) => handleChange(event)}
        className="peer hidden"
      />
      <div className="w-5 h-5 rounded bg-white border-2 border-gray-300 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500">
        <AnimatePresence>
          {props.checked && (
            <motion.svg
              key="checkbox"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-6 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </motion.svg>
          )}
        </AnimatePresence>
      </div>
      {props.label && (
        <span
          className={
            props.checked
              ? "select-none text-blue-400  transition-colors duration-300"
              : "select-none text-gray-300 transition-colors duration-300"
          }
        >
          {props.label}
        </span>
      )}
    </label>
  );
}
