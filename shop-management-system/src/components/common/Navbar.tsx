"use client";

import { usePathname } from "next/navigation";
import { Roles } from "../../../type/entity/entity";
import Image from "next/image";

interface IProps {
  role: string;
}

const Navbar = ({ role }: IProps) => {
  const pathname = usePathname(); // Get the current route

  const navLinks = [
    { href: "/home", label: "Inventory", roles: [Roles.ADMIN] },
    { href: "/order", label: "Order", roles: [Roles.ADMIN, Roles.EMPLOYEE] },
    { href: "/history", label: "History", roles: [Roles.ADMIN, Roles.EMPLOYEE] },
    { href: "/api/recommendation/refresh", label: "Refresh Model", roles: [Roles.ADMIN] },
  ];

  return (
    <nav className="bg-gray-300 shadow-md">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logoOnlineShopping.png" alt="" width={"170"} height={"100"}></Image>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex space-x-4">
            {navLinks.map(({ href, label, roles }) =>
            // roles.includes(role as Roles) ? 
            (
              <a
                key={href}
                href={href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${pathname === href ? "bg-gray-900 text-white" : "text-gray-800 hover:bg-gray-700 hover:text-white"
                  }`}
              >
                {label}
              </a>
            )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
