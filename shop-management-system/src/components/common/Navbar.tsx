"use client"

import { redirect, usePathname, useRouter } from "next/navigation";
import { Roles } from "../../../type/entity/entity";
import Image from "next/image";
import { LogOut } from 'lucide-react';

interface IProps {
  role: string;
}

const Navbar = ({ role }: IProps) => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route
  // If the current page is /login, don't render the navbar
  if (pathname === '/login') {
    return null; // Do not render anything on /login page
  }

  const handleLogout = async () => {
    // Trigger the server-side route for session deletion
    await fetch('/api/user/logout', { method: 'GET' });
    
    // Redirect manually after the session is deleted (optional as it's handled by the server-side logic)
    router.push('/login');
  };

  const navLinks = [
    { href: "/home", label: "Inventory", roles: [Roles.ADMIN] },
    { href: "/order", label: "Order", roles: [Roles.ADMIN, Roles.EMPLOYEE] },
    { href: "/history", label: "History", roles: [Roles.ADMIN, Roles.EMPLOYEE] },
    { href: "/api/recommendation/refresh", label: "Refresh Model", roles: [Roles.ADMIN] },
  ];
  
  return (
    <>
    <nav className="bg-gray-300 shadow-md">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logoOnlineShopping.png" alt="" width={"170"} height={"100"}></Image>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex space-x-4">
            {navLinks.map(({ href, label, roles }) => (
                roles.includes(role as Roles) ? (
                  <a
                    key={href}
                    href={href}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${pathname === href ? "bg-gray-900 text-white" : "text-gray-800 hover:bg-gray-700 hover:text-white"}`}
                  >
                    {label}
                  </a>
                ) : null
              ))}
            <button className="text-black" title="logout" onClick={handleLogout}><LogOut height={20}/></button>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
