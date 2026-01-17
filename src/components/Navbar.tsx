import { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaUserCircle, FaMoon, FaSun, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useTheme } from '../contexts/theme';
import { useLogout } from '../api/auth';
import logo from './logo.png';

export default function TopNavbar() {
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New project proposal submitted', time: '2 min ago' },
    { id: 2, text: 'Defense schedule updated', time: '1 hour ago' },
    { id: 3, text: 'Deadline approaching: Project submissions', time: '3 hours ago' },
  ]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme() ?? { theme: 'light', toggleTheme: () => {} };
  const navigate = useNavigate();
  const logout = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const handleLogout = () => {
    logout.mutate();
    navigate({ to: '/' });
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`py-2 ${theme === 'dark' ? 'bg-dark navbar-dark' : 'bg-white navbar-light'} ${
        isScrolled ? 'shadow-sm' : ''
      }`}
      style={{ transition: 'all 0.3s ease' }}
    >
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <motion.img
            src={logo}
            alt="Logo"
            height="40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
        </Navbar.Brand>

        <Nav className="ms-auto d-flex align-items-center gap-3">
          {/* Notifications Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle 
              as={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="position-relative bg-transparent border-0 p-0"
              style={{ cursor: 'pointer' }}
            >
              <FaBell size={20} className={theme === 'dark' ? 'text-light' : 'text-dark'} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className={`${theme === 'dark' ? 'dropdown-menu-dark' : ''} shadow`}>
              <div className="p-2">
                <h6 className="dropdown-header border-bottom pb-2">Notifications</h6>
                {notifications.map((notification) => (
                  <Dropdown.Item 
                    key={notification.id}
                    className="py-2 px-3 d-flex flex-column"
                  >
                    <span className="fw-medium">{notification.text}</span>
                    <small className="text-muted">{notification.time}</small>
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item className="text-center">
                  <small>View all notifications</small>
                </Dropdown.Item>
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* Theme Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            style={{ cursor: 'pointer' }}
          >
            {theme === 'dark' ? (
              <FaSun size={20} className="text-light" />
            ) : (
              <FaMoon size={20} className="text-dark" />
            )}
          </motion.div>

          {/* User Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle 
              as={motion.div}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="d-flex align-items-center gap-2 bg-transparent border-0"
              style={{ cursor: 'pointer' }}
            >
              <FaUserCircle size={24} className={theme === 'dark' ? 'text-light' : 'text-dark'} />
            </Dropdown.Toggle>

            <Dropdown.Menu className={`${theme === 'dark' ? 'dropdown-menu-dark' : ''} shadow`}>
              <Dropdown.Item as={Link} to="/dashboard" className="d-flex align-items-center gap-2">
                <FaUserCircle /> Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/settings" className="d-flex align-items-center gap-2">
                <FaCog /> Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={handleLogout}
                className="d-flex align-items-center gap-2 text-danger"
              >
                <FaSignOutAlt /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
