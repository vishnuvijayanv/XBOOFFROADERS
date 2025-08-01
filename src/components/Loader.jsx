import React, { useEffect, useState } from 'react';
import logo from '../assets/loader-logo.jpg';

const Loader = () => {
  const [text, setText] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const fullText = 'Loading your offroad adventure...';

  useEffect(() => {
    setFadeIn(true);
    
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(to bottom right, #ffffff, #f3f3f3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box',
    }}>
      <img
        src={logo}
        alt="BO Offroaders"
        style={{
          width: '220px',
          maxWidth: '80%',
          height: 'auto',
          opacity: fadeIn ? 1 : 0,
          transform: fadeIn ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 1.2s ease, transform 1.5s ease',
          borderRadius: '10px',
          boxShadow: '0 0 12px rgba(252, 59, 59, 0.3)', // Soft red glow
        }}
      />
      <p style={{
        marginTop: '30px',
        color: '#333',
        fontSize: '1.1rem',
        fontFamily: 'monospace',
        letterSpacing: '1px',
        textShadow: '0 0 4px rgba(255, 0, 0, 0.2)', // Soft red text glow
        height: '30px',
        textAlign: 'center',
      }}>
        {text}
      </p>
    </div>
  );
};

export default Loader;
