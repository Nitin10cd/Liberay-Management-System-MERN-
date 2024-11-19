import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Form.css';

const Login = ({ userId, setUserId }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    setLoading(true);
    try {
      const response = await axios.post('/api/users/login', { email, password });
      setLoading(false);

      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        const user = response.data.user.email;
        setUserId(user);

        if (response.data.user.role === 'admin') {
          navigate('/admin/home');
        } else {
          navigate('/user/home');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="body">
      <div className="form-container">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account? <a href="/">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
