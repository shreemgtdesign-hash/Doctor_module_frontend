import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({
    children,
    role,
}) => {
    // Default open on desktop (>=1024px), can be toggled open/closed by user
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== "undefined") {
            return window.innerWidth >= 1024;
        }
        return true;
    });

    return (
        <div className="relative min-h-screen bg-[#F6F6F4]">

            {/* Fixed Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                role={role}
            />

            {/* Main Area - Adjusts padding smoothly according to sidebar state */}
            <div
                className={`
                    flex
                    min-h-screen
                    w-full
                    flex-col
                    transition-all
                    duration-300
                    ease-in-out
                    ${sidebarOpen ? "lg:pl-[280px]" : "pl-0"}
                `}
            >

                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    role={role}
                />

                <main className="flex-1 w-full">
                    {children}
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;