import { useEffect, useState, type ReactNode } from "react";
import { Outlet } from "@tanstack/react-router";
import { TitleProvider } from "@/common/context/TitleContext";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { ScreenSearchModal } from "./ScreenSearchModal";

export type ProtectedLayoutProps = {
  children?: ReactNode;
};

export function ProtectedLayout({ children }: ProtectedLayoutProps = {}) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("app.desktop_sidebar_open");
    return saved !== null ? saved === "true" : true;
  });

  const handleToggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("app.desktop_sidebar_open", String(next));
      return next;
    });
  };

  // Global Ctrl + K / Cmd + K and Ctrl + B listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleToggleDesktopSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <TitleProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[var(--background)] font-sans text-[var(--foreground)] transition-colors duration-200">
        {/* Theme-aware Sidebar */}
        <Sidebar
          isOpenOnMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isOpenOnDesktop={isDesktopSidebarOpen}
          onToggleDesktop={handleToggleDesktopSidebar}
        />

        {/* Main Column */}
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          {/* Theme-aware TopNav Header */}
          <TopNav
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
            onToggleDesktopSidebar={handleToggleDesktopSidebar}
            isDesktopSidebarOpen={isDesktopSidebarOpen}
          />

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto min-w-0 bg-[var(--background)] p-6 transition-colors duration-200">
            {children ?? <Outlet />}
          </main>
        </div>

        {/* Global Screen Search Modal (Ctrl + K) */}
        <ScreenSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </div>
    </TitleProvider>
  );
}

export default ProtectedLayout;
