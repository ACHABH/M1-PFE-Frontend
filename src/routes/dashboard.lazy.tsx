import {
  createLazyFileRoute,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { FaBars, FaTimes } from "react-icons/fa";
import SideMenu from "../components/side-menu";
import { useAuth } from "../api/auth";
import { useTheme } from "../contexts/theme";

export const Route = createLazyFileRoute("/dashboard")({
  component: Component,
});

function Component() {
  const navigate = useNavigate();
  const user = useAuth((user) => {
    if (user || import.meta.env.DEV) return;
    navigate({ to: "/auth/login" });
  });
  const { theme } = useTheme() ?? { theme: 'light' };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleMenu = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 992);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    (import.meta.env.DEV ? true : user) && (
      <div className="dashboard-container">
        <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <h1 className="logo">PFE Manager</h1>
          </div>
          <SideMenu userRole={user!.role} />
        </aside>
        
        <main className="main-content">
          <nav className="top-navbar">
            <div className="nav-left">
              <button
                onClick={toggleMenu}
                className="menu-toggle"
                aria-label="Toggle Menu"
              >
                {isSidebarCollapsed ? <FaBars /> : <FaTimes />}
              </button>
            </div>
            <div className="nav-right">
              <div className="theme-toggle">
                {/* Add your theme toggle component here */}
              </div>
              <div className="user-profile">
                <span className="user-name">{user?.first_name} {user?.last_name || 'User'}</span>
                <img 
                  src={'https://ui-avatars.com/api/?name=User'} 
                  alt="Profile" 
                  className="avatar"
                />
              </div>
            </div>
          </nav>
          
          <div className="content-wrapper">
            <Outlet />
          </div>

          {/* <footer className="app-footer">
            <div className="footer-content">
              <p>&copy; {new Date().getFullYear()} PFE Manager. All rights reserved.</p>
            </div>
          </footer> */}
        </main>

        {/* Overlay for mobile */}
        {!isSidebarCollapsed && (
          <div className="sidebar-overlay" onClick={toggleMenu} />
        )}

        <style>{`
          .dashboard-container {
            display: flex;
            min-height: 100vh;
            position: relative;
            background-color: ${theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
            color: ${theme === 'dark' ? '#e4e6eb' : '#2d3748'};
          }

          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: 280px;
            background: ${theme === 'dark' ? '#2d2d2d' : '#ffffff'};
            border-right: 1px solid ${theme === 'dark' ? '#404040' : '#e2e8f0'};
            box-shadow: ${theme === 'dark' ? '2px 0 8px rgba(0,0,0,0.3)' : '0 0 20px rgba(0,0,0,0.05)'};
            z-index: 1000;
            transition: all 0.3s ease-in-out;
            display: flex;
            flex-direction: column;
          }

          .sidebar-header {
            padding: 1.5rem;
            border-bottom: 1px solid ${theme === 'dark' ? '#404040' : '#e2e8f0'};
          }

          .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: ${theme === 'dark' ? '#ffffff' : '#2d3748'};
            margin: 0;
          }

          .sidebar.collapsed {
            transform: translateX(-100%);
          }

          .top-navbar {
            background: ${theme === 'dark' ? '#2d2d2d' : '#ffffff'};
            padding: 1rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid ${theme === 'dark' ? '#404040' : '#e2e8f0'};
            height: 70px;
          }

          .nav-left, .nav-right {
            display: flex;
            align-items: center;
            gap: 1rem;
          }

          .user-profile {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 1rem;
            background: ${theme === 'dark' ? '#404040' : '#f1f5f9'};
            border-radius: 9999px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .user-profile:hover {
            background: ${theme === 'dark' ? '#4a4a4a' : '#e2e8f0'};
          }

          .user-name {
            font-weight: 500;
            font-size: 0.875rem;
          }

          .avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            object-fit: cover;
          }

          .main-content {
            flex: 1;
            margin-left: 280px;
            min-height: 100vh;
            transition: margin 0.3s ease-in-out;
            position: relative;
            background-color: ${theme === 'dark' ? '#1a1a1a' : '#f8f9fa'};
            display: flex;
            flex-direction: column;
          }

          .content-wrapper {
            flex: 1;
            padding: 2rem;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
          }

          .menu-toggle {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: ${theme === 'dark' ? '#404040' : '#f1f5f9'};
            color: ${theme === 'dark' ? '#ffffff' : '#2d3748'};
            border: none;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .menu-toggle:hover {
            background: ${theme === 'dark' ? '#4a4a4a' : '#e2e8f0'};
          }

          .app-footer {
            background: ${theme === 'dark' ? '#2d2d2d' : '#ffffff'};
            border-top: 1px solid ${theme === 'dark' ? '#404040' : '#e2e8f0'};
            padding: 1rem 1.5rem;
          }

          .footer-content {
            max-width: 1400px;
            margin: 0 auto;
            text-align: center;
            font-size: 0.875rem;
            color: ${theme === 'dark' ? '#9ca3af' : '#64748b'};
          }

          .sidebar-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 999;
          }

          @media (max-width: 991.98px) {
            .sidebar {
              width: 260px;
            }

            .main-content {
              margin-left: 0;
            }

            .menu-toggle {
              display: flex;
            }

            .sidebar-overlay {
              display: block;
            }

            .content-wrapper {
              padding: 1.5rem;
            }
          }

          @media (max-width: 575.98px) {
            .sidebar {
              width: 240px;
            }

            .content-wrapper {
              padding: 1rem;
            }

            .user-name {
              display: none;
            }

            .user-profile {
              padding: 0.5rem;
            }
          }
        `}</style>
      </div>
    )
  );
}
