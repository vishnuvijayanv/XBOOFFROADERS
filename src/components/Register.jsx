import React, { useState, useEffect } from 'react';
import logo from '../assets/loader-logo.jpg';
import riderImage from '../assets/loader-logo.jpg'; // Replace with your actual bike rider image

const Register = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showTerms, setShowTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    place: '',
    vehicleNumber: '',
    address: '',
    bloodGroup: '',
    mobile: '',
    password: '',
    agreed: false,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const required = isRegister
      ? ['name', 'place', 'vehicleNumber', 'address', 'bloodGroup', 'mobile', 'password']
      : ['mobile', 'password'];
    for (let field of required) {
      if (!formData[field]) {
        alert(`Please fill in ${field}`);
        return;
      }
    }
    if (isRegister && !formData.agreed) {
      return alert('Please agree to Terms & Conditions');
    }
    alert(isRegister ? 'Registration successful' : 'Login successful');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#fff',
        padding: isMobile ? '20px' : '60px 100px',
        boxSizing: 'border-box',
      }}
    >
      {/* Form Section */}
      <div
        style={{
          flex: 1,
          maxWidth: '500px',
          width: '100%',
          padding: isMobile ? '20px' : '0',
        }}
      >
        {isMobile && (
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <img
              src={logo}
              alt="logo"
              style={{ height: '60px', borderRadius: '50%' }}
            />
          </div>
        )}

        <h2
          style={{
            textAlign: 'left',
            color: '#f44336',
            marginBottom: '20px',
            fontSize: '2rem',
            borderBottom: '4px solid #f44336',
            display: 'inline-block',
          }}
        >
          {isRegister ? 'Register' : 'Login'}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {isRegister && (
            <>
              <Input label="Name" name="name" value={formData.name} onChange={handleChange} />
              <Input label="Place" name="place" value={formData.place} onChange={handleChange} />
              <Input label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} />
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
              <Input label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
            </>
          )}
          <Input label="Mobile Number" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} />
          <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />

          {isRegister && (
            <label style={{ fontSize: '0.9rem', color: '#333', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                name="agreed"
                checked={formData.agreed}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              I agree to the
              <span
                onClick={() => setShowTerms(true)}
                style={{
                  color: '#f44336',
                  marginLeft: '5px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Terms and Conditions
              </span>
            </label>
          )}

          <button type="submit" style={{
          backgroundColor: '#f44336', color: '#fff', padding: '14px',
          border: 'none', fontWeight: 'bold', fontSize: '1rem',
          borderRadius: '6px', cursor: 'pointer', transform: 'skewX(-10deg)'
        }}>
            {isRegister ? 'Register' : 'Login'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            {isRegister ? 'Already registered?' : 'New here?'}
            <span
              onClick={() => setIsRegister(!isRegister)}
              style={{
                color: '#f44336',
                marginLeft: '6px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {isRegister ? 'Login' : 'Register'}
            </span>
          </p>
        </form>
      </div>

      {/* Image Section for Desktop */}
      {!isMobile && (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={riderImage}
            alt="bike rider"
            style={{
              maxWidth: '500px',
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            width: '90%', maxWidth: '500px',
            background: '#fff', padding: '30px',
            borderRadius: '15px', maxHeight: '80vh',
            overflowY: 'auto', boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ color: '#f44336', marginBottom: '15px' }}>Terms and Conditions</h3>
            <p style={{ fontSize: '0.95rem', color: '#333', lineHeight: '1.5' }}>
              • All bikes are allowed.<br />
              • Valid documents required.<br />
              • Helmet, shoes, and riding gear required.<br />
              • Rash driving = disqualification.
            </p>
            <button onClick={() => setShowTerms(false)} style={{
              marginTop: '20px', padding: '10px 20px',
              backgroundColor: '#f44336', color: '#fff',
              border: 'none', borderRadius: '10px',
              fontWeight: 'bold', cursor: 'pointer'
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = 'text' }) => (
  <input
    type={type}
    name={name}
    placeholder={`Enter ${label}`}
    value={value}
    onChange={onChange}
    required
    style={{
      padding: '12px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      background: '#f5f5f5',
      fontSize: '1rem',
    }}
  />
);

export default Register;
