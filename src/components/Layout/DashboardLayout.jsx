import {
    useState,
} from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import {
    SidebarContext,
} from "./SidebarContext";

const DashboardLayout = ({
    children,
    role,
}) => {

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
                    role={role}
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
                        role={role}
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