
    import React, { useState, useEffect } from "react";
    import { Outlet, useLocation } from "react-router-dom";
    import Header from "@/components/Header"; 
    import { cn } from "@/lib/utils";

    const Layout = () => {
      const location = useLocation();
      
      // Sidebar state is no longer needed here as we are removing it.
      // const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
      // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

      // useEffect(() => {
      //   const handleResize = () => {
      //     if (window.innerWidth < 768) {
      //       setIsSidebarOpen(false);
      //     } else if (window.innerWidth < 1024) {
      //       setIsSidebarOpen(false); 
      //     } else {
      //       setIsSidebarOpen(true);
      //     }
      //   };
      //   window.addEventListener('resize', handleResize);
      //   handleResize();
      //   return () => window.removeEventListener('resize', handleResize);
      // }, []);

      const isNodeBasePage = location.pathname.startsWith('/nodebase');
      const isSettingsPage = location.pathname.startsWith('/settings');
      
      return (
        <div className="flex flex-col h-screen bg-background text-foreground">
          {/* Sidebar component is removed */}
          {/* <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}
          
          <Header 
            // toggleSidebar={toggleSidebar} // No longer needed from Header for main sidebar
            // isSidebarOpen={isSidebarOpen} // No longer needed
          />
          <main className={cn(
              "flex-1 overflow-x-hidden overflow-y-auto bg-muted/20",
              (isNodeBasePage || isSettingsPage) ? "p-0" : "p-4 md:p-6 lg:p-8"
          )}>
            <Outlet />
          </main>
          {/* Overlay for mobile sidebar is also removed */}
          {/* {isSidebarOpen && window.innerWidth < 768 && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleSidebar}
            ></div>
          )} */}
        </div>
      );
    };

    export default Layout;
  