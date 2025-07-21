import React, { useState, useEffect } from 'react';
import { FiSearch, FiHome, FiInfo, FiSettings, FiMail, FiArrowRight } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <a href="/" className="navbar-brand">
          <FiSearch className="nav-icon" />
          SigmaSeek
        </a>
        
        <ul className={`navbar-nav ${isOpen ? 'open' : ''}`}>
          <li className="nav-item">
            <a href="/" className="nav-link active">
              <FiHome className="nav-icon" />
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/about" className="nav-link">
              <FiInfo className="nav-icon" />
              About
            </a>
          </li>
          <li className="nav-item">
            <a href="/services" className="nav-link">
              <FiSettings className="nav-icon" />
              Services
            </a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link">
              <FiMail className="nav-icon" />
              Contact
            </a>
          </li>
          <li className="nav-item">
            <a href="/get-started" className="cta-button">
              Get Started <FiArrowRight className="nav-icon" />
            </a>
          </li>
        </ul>

        <button className="navbar-toggle" onClick={toggleNavbar}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;