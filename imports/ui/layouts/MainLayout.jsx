import React from "react";
import { Outlet } from "react-router-dom";
import NewNavbar from "/imports/ui/components/NewNavbar";

export default function MainLayout() {
  return (
    <div className="min-h-dvh p-3 lg:p-0 bg-white/50">
      <div className="md:p-4 py-2">
        <NewNavbar />
      </div>
      <div className="max-w-5xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
