"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "./Layout";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const noLayoutPages = ["/login"];
  const isNoLayoutPage = noLayoutPages.includes(pathname);

  useEffect(() => {
    // If it's login page, don't check authentication
    if (isNoLayoutPage) {
      setIsChecking(false);
      return;
    }

    // Check if token exists in sessionStorage
    const checkAuth = () => {
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        // No token found, redirect to login immediately
        router.replace('/login');
        return;
      }
      
      // Token exists, allow rendering
      setIsAuthenticated(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, isNoLayoutPage, router]);

  // Show nothing while checking authentication (prevents flash)
  if (!isNoLayoutPage && isChecking) {
    return null; // Or return a loading spinner if you prefer
  }

  // If not authenticated and checking is done, don't render (redirect will happen)
  if (!isNoLayoutPage && !isAuthenticated && !isChecking) {
    return null;
  }

  // Render login page or authenticated layout
  return isNoLayoutPage ? children : <Layout>{children}</Layout>;
}
