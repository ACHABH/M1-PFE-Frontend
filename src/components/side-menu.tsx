import type { UserRole } from "../constant/enum";
import { Link, useNavigate } from "@tanstack/react-router";
import { Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/theme";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaArchive,
  FaUsersCog,
  FaFolder,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaFileAlt,
  FaUserCheck,
  FaFolderOpen,
  FaEnvelope,
  FaClipboardList,
  FaBell,
} from "react-icons/fa";

type Props = {
  userRole: UserRole;
  pendingAmount?: number;
};

const menuVariants = {
  hidden: { 
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2
    }
  },
  visible: { 
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.2
    }
  }
};

const MenuItem = ({ to, icon: Icon, label, badge }: { to: string; icon: any; label: string; badge?: number }) => {
  const { theme } = useTheme() ?? { theme: 'light' };
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate({ to })}
      className={`menu-item ${theme === 'dark' ? 'menu-item-dark' : ''}`}
    >
      <Icon className="menu-icon" />
      <span>{label}</span>
      {badge && (
        <span className="badge bg-danger rounded-pill ms-auto">
          {badge}
        </span>
      )}
    </motion.div>
  );
};

const MenuSection = ({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void; 
  children: React.ReactNode 
}) => {
  const { theme } = useTheme() ?? { theme: 'light' };
  
  return (
    <div className={`menu-section ${theme === 'dark' ? 'menu-section-dark' : ''}`}>
      <motion.button
        className={`menu-section-header ${theme === 'dark' ? 'menu-section-header-dark' : ''}`}
        onClick={onToggle}
        whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
        whileTap={{ scale: 0.98 }}
      >
        <h6 className="mb-0">{title}</h6>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </motion.div>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="menu-section-content"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SideMenu({ userRole }: Props) {
  const [menuOpen, setMenuOpen] = useState({
    isUserManagement: true,
    isScheduleManagement: true,
    isProjectManagement: true,
    isTeacherScheduleManagement: true,
  });
  const [pendingAmount, setPendingAmount] = useState(0);
  const { theme } = useTheme() ?? { theme: 'light' };

  useEffect(() => {
    // Simulate fetching data
    const pendingAmountFromServer = 2;
    setPendingAmount(pendingAmountFromServer);
  }, []);

  return (
    <Nav className={`side-menu ${theme === 'dark' ? 'side-menu-dark' : ''}`}>
      {userRole === "teacher" && (
        <Nav className="w-100">
          <div className="menu-group">
            <MenuItem to="/dashboard/teacher/dashboard" icon={FaHome} label="Dashboard" />
            <MenuItem to="/dashboard/teacher/archive" icon={FaArchive} label="Archive" />
          </div>

          <MenuSection
            title="Project Management"
            isOpen={menuOpen.isProjectManagement}
            onToggle={() =>
              setMenuOpen((prev) => ({
                ...prev,
                isProjectManagement: !prev.isProjectManagement,
              }))
            }
          >
            <MenuItem to="/dashboard/teacher/submit-proposal" icon={FaFileAlt} label="Submit Proposal" />
            <MenuItem to="/dashboard/teacher/defense-selction" icon={FaUserCheck} label="Defense Selection" />
            <MenuItem to="/dashboard/teacher/supervise-projects" icon={FaFolderOpen} label="Supervise Projects" />
            <MenuItem 
              to="/dashboard/teacher/pending-revisions" 
              icon={FaBell} 
              label="Pending Revisions"
              badge={pendingAmount}
            />
            <MenuItem 
              to="/dashboard/teacher/my-supervised-projects" 
              icon={FaClipboardList} 
              label="Projects I Supervise" 
            />
          </MenuSection>

          <MenuSection
            title="Schedule"
            isOpen={menuOpen.isTeacherScheduleManagement}
            onToggle={() =>
              setMenuOpen((prev) => ({
                ...prev,
                isTeacherScheduleManagement: !prev.isTeacherScheduleManagement,
              }))
            }
          >
            <MenuItem 
              to="/dashboard/teacher/manage-defense-schedule" 
              icon={FaCalendarAlt} 
              label="Jury Schedule" 
            />
          </MenuSection>
        </Nav>
      )}

      {userRole === "admin" && (
        <Nav className="w-100">
          <div className="menu-group">
            <MenuItem to="/dashboard/admin/dashboard" icon={FaHome} label="Dashboard" />
            <MenuItem to="/dashboard/admin/pfe-proposals" icon={FaFolder} label="PFE Proposals" />
            <MenuItem to="/dashboard/admin/archive" icon={FaArchive} label="Archive" />
          </div>

          <MenuSection
            title="Management"
            isOpen={menuOpen.isUserManagement}
            onToggle={() =>
              setMenuOpen((prev) => ({
                ...prev,
                isUserManagement: !prev.isUserManagement,
              }))
            }
          >
            <MenuItem to="/dashboard/admin/supervision" icon={FaUserCheck} label="Assign Supervisor" />
            <MenuItem to="/dashboard/admin/project-management" icon={FaFolder} label="Projects" />
            <MenuItem to="/dashboard/admin/user-management" icon={FaUsersCog} label="Users" />
            <MenuItem to="/dashboard/admin/email-template" icon={FaEnvelope} label="Emails Template" />
          </MenuSection>

          <MenuSection
            title="Schedule Management"
            isOpen={menuOpen.isScheduleManagement}
            onToggle={() =>
              setMenuOpen((prev) => ({
                ...prev,
                isScheduleManagement: !prev.isScheduleManagement,
              }))
            }
          >
            <MenuItem 
              to="/dashboard/admin/manage-defense-schedule" 
              icon={FaCalendarAlt} 
              label="Defense Schedule" 
            />
          </MenuSection>
        </Nav>
      )}

      <style>{`
        .side-menu {
          min-height: 100vh;
          padding: 1.5rem 1rem;
          background: var(--bs-body-bg);
          border-right: 1px solid var(--bs-border-color);
          width: 100%;
        }

        .side-menu-dark {
          background: var(--bs-dark);
        }

        .menu-group {
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--bs-border-color);
        }

        .menu-section {
          margin-bottom: 1rem;
        }

        .menu-section-dark .menu-section-header {
          color: var(--bs-light);
        }

        .menu-section-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          border-radius: 0.5rem;
          color: var(--bs-body-color);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .menu-section-content {
          padding: 0.5rem 0;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: var(--bs-body-color);
          text-decoration: none;
          border-radius: 0.5rem;
          margin-bottom: 0.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .menu-item:hover {
          background: ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
        }

        .menu-item-dark {
          color: var(--bs-light);
        }

        .menu-icon {
          margin-right: 0.75rem;
          font-size: 1.1rem;
          color: var(--bs-primary);
        }

        .badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }

        @media (max-width: 991.98px) {
          .side-menu {
            padding: 1rem 0.75rem;
          }
        }
      `}</style>
    </Nav>
  );
}
