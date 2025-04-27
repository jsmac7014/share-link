import React from "react";
import { Outlet } from "react-router-dom";
import NewNavbar from "/imports/ui/components/NewNavbar";

export default function MainLayout() {
  return (
    <div className="p-3 lg:p-0 min-h-dvh bg-gray-100">
      <div className="md:p-4 py-2">
        <NewNavbar />
      </div>
      <div className="max-w-5xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
