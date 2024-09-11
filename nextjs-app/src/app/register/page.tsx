'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './styles/Register.module.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL_REGISTER_USER}`, {
        username,
        email,
        phoneNumber,
        password,
      });

      if (response.status === 201 && response.data?.error) {
        setError(response.data.message || 'Registration failed');
      } else {
        setSuccess('Registration successful!');
        // Clear the input fields
        setUsername('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <div className={styles.passwordContainer}>
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span 
            className={styles.eyeIcon} 
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        <button type="submit" className={styles.button}>Register</button>

        {success && <p className={styles.success}>{success}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </form>
      <p className="mt-10 text-center text-sm text-gray-600">
        Already have an account? <Link href="/login" className="text-indigo-600 hover:text-indigo-500">Login here</Link>
      </p>   
    </div>
  );
};

export default Register;
