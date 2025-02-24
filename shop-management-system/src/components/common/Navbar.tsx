/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Roles } from "../../../type/entity/entity";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAlert } from "@/context/AlertContext";

interface IProps {
  role: string;
}

const Navbar = ({ role }: IProps) => {
  const router = useRouter();
  role = "ADMIN";
  const pathname = usePathname(); // Get the current route

  // If the current page is /login, don't render the navbar
  if (pathname === "/login") {
    return null;
  }
  const { showAlert } = useAlert();
  const [message, setMessage] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch user details from session
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user-session");
        const result = await response.json();
        setUser(result.user); // Assuming API returns `{ user: { name, email } }`
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/user/logout", { method: "GET" });
    showAlert("Successfully logged out", "success");
  };

  // Close profile card when clicking outside
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRefreshModel = async () => {
    try {
      const response = await fetch("/api/recommendation/refresh", { method: "GET" });
      const result = await response.json(); // Assuming it returns `{ success: true }` or `{ success: false }`

      if (result.success) {
        setMessage("Successfully refreshed the model!");
      } else {
        setMessage("Failed to refresh the model. Please try again.");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage("An error occurred while refreshing the model.");
    }
  };

  const navLinks = [
    { href: "/home", label: "Inventory", roles: [Roles.ADMIN] },
    { href: "/order", label: "Order", roles: [Roles.ADMIN, Roles.EMPLOYEE] },
    { href: "/history", label: "History", roles: [Roles.ADMIN, Roles.EMPLOYEE] },
    { href: "#", label: "Refresh Model", roles: [Roles.ADMIN], onClick: handleRefreshModel },
  ];

  return (
    <>
      <nav className="bg-gray-300 shadow-md">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Image src="/logoOnlineShopping.png" alt="" width={170} height={100} />
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:flex space-x-4">
              {navLinks.map(({ href, label, roles, onClick }) =>
                roles.includes(role as Roles) ? (
                  <a
                    key={href}
                    href={href !== "#" ? href : undefined}
                    onClick={onClick}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${pathname === href ? "bg-gray-900 text-white" : "text-gray-800 hover:bg-gray-700 hover:text-white"
                      }`}
                  >
                    {label}
                  </a>
                ) : null
              )}

              {/* Profile Button (Replaces Logout Button) */}
              <div className="relative">
                <button className="text-black flex items-center space-x-2 mt-1" title="Profile" onClick={() => setShowProfile(!showProfile)}>
                  <UserCircle size={24} />
                </button>

                {/* Profile Card */}
                {showProfile && user && (
                  <div
                    ref={profileRef}
                    className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <UserCircle size={40} className="text-gray-700" />
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <hr className="my-3 border-gray-300" />
                    <button
                      className="w-full py-2 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Success or Failure Popup */}
      {message && (
        <div className="fixed top-5 right-5 bg-gray-800 text-white p-3 rounded-md shadow-lg">
          {message}
          <button className={`ml-3 ${message.includes("Successfully") ? "text-green-400" : "text-red-400"}`} onClick={() => setMessage(null)}>
            ✖
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
