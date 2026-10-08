import {
    useState,
} from "react";
import { useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import {
    SidebarContext,
} from "./SidebarContext";

const DashboardLayout = ({
    children,
    role,
}) => {
    const location = useLocation();

    const resolvedRole =
        role ||
        (location?.pathname?.startsWith("/corporate") ? "corporate" : undefined) ||
        (location?.pathname?.startsWith("/pharmacist") ? "pharmacist" : undefined) ||
        (location?.pathname?.startsWith("/therapist") ? "therapist" : undefined) ||
        (location?.pathname?.startsWith("/duty-doctor") ? "duty-doctor" : undefined) ||
        (location?.pathname?.startsWith("/junior-doctor") ? "junior-doctor" : undefined) ||
        (location?.pathname?.startsWith("/frontoffice") ? "frontoffice" : undefined) ||
        "doctor";

    const [
        sidebarOpen,
        setSidebarOpen,
    ] = useState(() => {

        if (
            typeof window !== "undefined"
        ) {
            return window.innerWidth >= 1024;
        }

        return true;
    });

    return (
        <SidebarContext.Provider
            value={{
                sidebarOpen,
                setSidebarOpen,
            }}
        >
            <div
                className="
                    relative
                    min-h-screen
                    bg-[#F6F6F4]
                "
            >

                <Sidebar
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                    role={resolvedRole}
                />

                <div
                    className={`
                        flex
                        min-h-screen
                        w-full
                        flex-col
                        transition-all
                        duration-300
                        ease-in-out
                        ${sidebarOpen
                            ? "lg:pl-[280px]"
                            : "pl-0"
                        }
                    `}
                >

                    <Header
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={
                            setSidebarOpen
                        }
                        role={resolvedRole}
                    />

                    <main
                        className="
        flex-1
        w-full
        pt-16
        sm:pt-20
        lg:pt-[88px]
    "
                    >
                        {children}
                    </main>

                </div>

            </div>
        </SidebarContext.Provider>
    );
};

export default DashboardLayout;