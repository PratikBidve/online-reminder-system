import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LoginPage - User login form for Online Reminder System
 */
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await import('../utils/api').then(api => api.login(email, password));
      if (res.token) {
        (await import('../utils/api')).setToken(res.token);
        window.location.href = '/reminders';
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <button className="signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default LoginPage;
