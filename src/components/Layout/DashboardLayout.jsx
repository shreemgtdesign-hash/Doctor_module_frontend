import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F6F4] relative overflow-hidden">

      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "blur-sm" : ""
        }`}
      >
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;