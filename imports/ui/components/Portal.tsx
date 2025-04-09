import React from "react";
import { createPortal } from "react-dom";

const Portal = ({ children }: { children: React.ReactNode }) => {
  const rootElement = document.getElementById("#modal-root");

  return <>{rootElement ? createPortal(children, rootElement) : children}</>;
};

export default Portal;
