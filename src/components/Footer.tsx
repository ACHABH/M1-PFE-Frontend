import { Container, Row, Col } from 'react-bootstrap';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { useTheme } from '../contexts/theme';

const socialLinks = [
  { icon: FaGithub, href: '#', label: 'GitHub' },
  { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
];

const quickLinks = [
  { text: 'About Us', href: '/about' },
  { text: 'Contact', href: '/contact' },
  { text: 'Privacy Policy', href: '/privacy' },
  { text: 'Terms of Service', href: '/terms' },
];

const contactInfo = [
  { icon: FaEnvelope, text: 'contact@pfemanager.com' },
  { icon: FaPhone, text: '+1 234 567 890' },
  { icon: FaMapMarkerAlt, text: '123 University Street, City, Country' },
];

export default function Footer() {
  const { theme } = useTheme() ?? { theme: 'light' };
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Container>
        <Row className="g-4">
          {/* Logo and Description */}
          <Col lg={4}>
            <div className="pe-lg-5">
              <Link to="/" className="d-inline-block mb-3">
                <motion.img
                  src="/logo.png"
                  alt="Logo"
                  height="40"
                  whileHover={{ scale: 1.05 }}
                />
              </Link>
              <p className="text-muted mb-4">
                PFE Manager helps universities streamline the management of final year projects,
                making it easier for students, teachers, and administrators to collaborate effectively.
              </p>
              <div className="d-flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${theme === 'dark' ? 'text-light' : 'text-dark'} fs-5`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon />
                  </motion.a>
                ))}
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col sm={6} lg={4}>
            <h5 className="mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              {quickLinks.map(({ text, href }) => (
                <motion.li
                  key={text}
                  whileHover={{ x: 5 }}
                  className="mb-2"
                >
                  <Link
                    to={href}
                    className={`${
                      theme === 'dark' ? 'text-light' : 'text-dark'
                    } text-decoration-none`}
                  >
                    {text}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </Col>

          {/* Contact Information */}
          <Col sm={6} lg={4}>
            <h5 className="mb-4">Contact Us</h5>
            <ul className="list-unstyled">
              {contactInfo.map(({ icon: Icon, text }) => (
                <motion.li
                  key={text}
                  whileHover={{ x: 5 }}
                  className="mb-3 d-flex align-items-center gap-2"
                >
                  <Icon className="text-primary" />
                  <span className="text-muted">{text}</span>
                </motion.li>
              ))}
            </ul>
          </Col>
        </Row>

        {/* Copyright */}
        <motion.div
          className="text-center pt-4 mt-4 border-top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="mb-0 text-muted">
            © {currentYear} PFE Manager. All rights reserved.
          </p>
        </motion.div>
      </Container>
    </footer>
  );
}
