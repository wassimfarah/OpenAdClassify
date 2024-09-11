'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from './styles/Login.module.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL_LOGIN_USER;
    if (!backendUrl) {
      setMessage('Backend URL not defined');
      return;
    }
  
    try {
      const { status, data } = await axios.post(backendUrl, { email, password }, { withCredentials: true });
  
      if (status === 200 || status === 201) {
        if (data?.statusCode === 401) {
          setMessage(data.error || 'Login failed');
          setSuccess(false);
        } else {
          setMessage('Login successful');
          setSuccess(true);
          window.location.replace('/');
        }
      } else {
        setMessage(`Unexpected response status: ${status}`);
        setSuccess(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.status === 401
          ? 'Invalid credentials'
          : error.response?.data || error.message;
        const truncatedMsg = errorMsg.length > 120 ? `${errorMsg.slice(0, 100)}...` : errorMsg;
        setMessage(`Login failed: ${truncatedMsg}`);
      } else {
        const truncatedError = `Unexpected error: ${error}`.slice(0, 100);
        setMessage(truncatedError);
      }
      setSuccess(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <button type="submit" className={styles.button}>Login</button>

        {message && <p className={success ? styles.success : styles.error}>{message}</p>}
      </form>
      <p className="mt-10 text-center text-sm text-gray-600">
        Don't have an account? <Link href="/register" className="text-indigo-600 hover:text-indigo-500">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
