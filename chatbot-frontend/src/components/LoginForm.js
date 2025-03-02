import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Example of a mock user database
const users = [
  {
    email: 'kellyegorman@gmail.com',
    password: 'password',
  },
  {
    email: 'admin@example.com',
    password: 'adminpass',
  },
];

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // For sign-up
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Track if the user wants to sign up
  const navigate = useNavigate();

  // Handle sign-in form submission
  const handleSignIn = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    const user = users.find((user) => user.email === email);

    if (!user) {
      setError('User not found');
      return;
    }

    if (user.password !== password) {
      setError('Incorrect password');
      return;
    }

    setError('');
    console.log('Sign-in successful');
    navigate('/chat');
  };

  // Handle sign-up form submission
  const handleSignUp = (e) => {
    e.preventDefault();

    if (!email || !password || !username) {
      setError('All fields are required');
      return;
    }

    // Check if the email is already registered
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      setError('User already exists');
      return;
    }

    // Add new user to the "database"
    users.push({ email, password, username });

    setError('');
    console.log('Sign-up successful');
    setIsSignUp(false); // Switch back to sign-in after successful sign-up
    navigate('/chat');
  };

  const displayUsers = () => {
    console.log(users); // Log the list of users
  };

  return (
    <div className="signin-container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        {isSignUp && (
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
      <button onClick={displayUsers}>Display All Users</button> {/* Button to display users */}
    </div>
  );
};

export default LoginForm;
