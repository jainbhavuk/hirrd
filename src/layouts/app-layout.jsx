import Header from "@/components/ui/header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container p-4 m-0 m-auto">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 mt-10 text-center bg-gray-800">
        Made With ❤ By Bhavuk Jain
      </div>
    </div>
  );
};

export default AppLayout;
