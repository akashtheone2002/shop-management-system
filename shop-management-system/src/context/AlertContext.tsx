"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Alert {
    message: string;
    type: "success" | "error";
}

interface AlertContextProps {
    alert: Alert | null;
    showAlert: (message: string, type: "success" | "error") => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [alert, setAlert] = useState<Alert | null>(null);

    const showAlert = (message: string, type: "success" | "error") => {
        setAlert({ message, type });

        // Auto-hide after 5 seconds
        setTimeout(() => {
            setAlert(null);
        }, 5000);
    };

    return (
        <AlertContext.Provider value={{ alert, showAlert }}>
            {children}

            {/* Beautiful Alert Popup */}
            {alert && (
                <div style={{ left: "40%", marginTop: "50px" }}
                    className={`absolute z-<1000> top-0 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-xl bg-opacity-90 ${alert.type === "success"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                        } 
                    transition duration-300 ease-in-out hover:shadow-2xl cursor-pointer`}
                >
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            {/* Success or Error icon */}
                            {alert.type === "success" ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-6 h-6 text-white"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-6 h-6 text-white"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </div>
                        <div>
                            <p className="font-medium">{alert.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};
