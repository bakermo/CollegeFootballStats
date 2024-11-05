import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavItem {
  title: string;
  path: string;
}

const navigationItems: NavItem[] = [
  { title: "Game Changers", path: "/player-impact" },
  { title: "Star Power", path: "/recruits-to-pros" },
  { title: "Conference Clash", path: "/conference-evolution" },
  { title: "Sideline Shuffle", path: "/coaching-impact" },
  { title: "Draft Day Dividends", path: "/draft-metrics" }
];

const NavigationHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header style={{
      backgroundColor: 'var(--header-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Title */}
        <div style={{
          color: 'white',
          fontSize: '1.25rem',
          fontWeight: '500'
        }}>
          College Football Stat Hub
        </div>

        {/* Menu Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              color: 'white',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'transparent',
              border: 'none'
            }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              minWidth: '200px',
              overflow: 'hidden'
            }}>
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    color: location.pathname === item.path ? 'var(--header-color)' : 'var(--text-primary)',
                    textDecoration: 'none',
                    backgroundColor: location.pathname === item.path ? 'var(--gray-50)' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--gray-50)';
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;