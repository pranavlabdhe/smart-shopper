import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password }),
      });
      const data = await res.json();
      if (res.ok) navigate('/login');
      else alert(data.message || 'Signup failed');
    } catch (err) {
      alert('Error signing up');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input type="text" placeholder="Name" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;