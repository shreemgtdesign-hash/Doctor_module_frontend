import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({
    children,
    role,
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#F6F6F4]">

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                role={role}
            />

            {/* Main */}
            <div
                className={`transition-all duration-300 ${
                    sidebarOpen ? "blur-sm" : ""
                }`}
            >

                <Header
                    setSidebarOpen={setSidebarOpen}
                    role={role}
                />

                <main>
                    {children}
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;