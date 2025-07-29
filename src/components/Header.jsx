import { useState, useEffect } from 'react';
import logo from '../../public/favicon.ico';

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    header: {
      width: '100%',
      padding: '12px 20px',
      backgroundColor: '#fff',
      color: '#000',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxSizing: 'border-box',
    },
    logo: {
      height: '50px',
    },
    nav: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
    },
    link: {
      color: '#000',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: 'bolder',
    },
    button: {
      backgroundColor: '#fff', // deep red
      color: '#000',
      border: '2px solid red',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#fff',
      color: '#000',
      border: '2px solid #e60000',
    },
    hamburger: {
      fontSize: '1.8rem',
      color: '#000',
      cursor: 'pointer',
    },
    mobileMenu: {
      position: 'absolute',
      top: '70px',
      right: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '10px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
  };

  const [hovered, setHovered] = useState(false);

  const navLinks = (
    <>
      <a href="#home" style={styles.link}>Home</a>
      <a href="#rides" style={styles.link}>Rides</a>
      <a href="#bookings" style={styles.link}>Bookings</a>
      <a href="#about" style={styles.link}>About</a>
      <a href="#contact" style={styles.link}>Contact</a>
    </>
  );

  return (
    <header style={styles.header}>
      <img src={logo} alt="BO Offroaders" style={styles.logo} />

      {!isMobile && (
        <nav style={styles.nav}>
          {navLinks}
          <button
            style={hovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => window.location.href = '#bookings'} // adjust for routing
          >
            Book Next Ride
          </button>
        </nav>
      )}

      {isMobile && (
        <>
          <div style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </div>
          {menuOpen && (
            <div style={styles.mobileMenu}>
              {navLinks}
              <button
                style={hovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => window.location.href = '#bookings'}
              >
                Book Next Ride
              </button>
              <hr  />
              <hr  />
            </div>
          )}
        </>
      )}
    </header>
  );
};

export default Header;
