import React from "react";
import { Hello } from "../components/Hello";
import { Info } from "../components/Info";

export default function MainPage() {
  return (
    <div className="h-full max-w-3xl mx-auto sm:pt-5">
      <Hello />
      <Info />
    </div>
  );
}
