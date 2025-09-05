// Updated Header.tsx with mobile menu functionality
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMobileMenuOpen, onMobileMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="mobile-menu-toggle" 
          onClick={onMobileMenuToggle}
          aria-label="Toggle document library"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        <h1>Document Q&A</h1>
      </div>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'light' ? '☀️' : '🌙'}
      </button>
    </header>
  );
};

export default Header;