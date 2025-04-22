import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNavBar from "./MobileNavBar";

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const mainContentRef = useRef(null);

  // Reset scroll position when route changes
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 8, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile bottom navigation - only visible on mobile */}
      <MobileNavBar />
      
      {/* Sidebar for desktop - fixed position with full height */}
      <div className="hidden lg:block lg:fixed lg:top-0 lg:bottom-0 lg:left-0 lg:z-10 lg:h-screen">
        <Sidebar
          isMobile={false}
          isOpen={true}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>

      {/* Main content - with left margin for sidebar on desktop */}
      <div className="flex flex-col w-full lg:pl-64 flex-1">
        <Header />

        <main ref={mainContentRef} className="flex-1 relative focus:outline-none">
          <motion.div
            className="py-6 px-4 sm:px-6 lg:px-8 lg:pb-12 pb-24"
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
