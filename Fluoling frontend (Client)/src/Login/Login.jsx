import React, { useState, useEffect } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();

  const {state} = location;

  const navigate = useNavigate();


  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'GET',
        credentials: 'include' // Include cookies in the request
      });

      

      if (response.ok) {
        // User is authenticated, redirect to dashboard
        const responseData = await response.json(); // Parse the response body as JSON
        const redirectUrl = responseData.redirect; // Access the redirect property

        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Call the fetchData function only once when the component mounts



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorMessage(''); // Clear any previous error message when user starts typ
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        // Handle unauthorized access
        if (response.status === 401) {
            setErrorMessage("Unauthorized access");
        } else {
            throw new Error('Failed to login');
        }
    } else {
        // Successful authentication, parse response body
        const responseData = await response.json();
        if (responseData.success) {
            // Redirect to dashboard
            window.location.href = responseData.redirect;
        } else {
            // Display error message
            setErrorMessage(responseData.message);
        }
    }
} catch (error) {
    console.error('Error during login:', error);
     
    }
  };


  return (
    <div>
      <h2>Login</h2>
      {state && state.successMessage && (
        <div className="success-message">
          <p>Successful registration. Please log in now.</p>
        </div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/users/register">Register here</Link></p>
    </div>
  );
}

export default Login;


// import React from 'react';

// function Login() {
//   return (
    
//       <div>
//         <h1>Login</h1>

        

//         <form action="api/users/login" method="POST">
//           <div>
//             <input type="email" id="email" name="email" placeholder="Email" required />
//           </div>
//           <div>
//             <input type="password" id="password" name="password" placeholder="password" required />
//           </div>
//           <div>
//             <input type="submit" value="Login" />
//           </div>
//         </form>

//         <a href="/users/register">Register</a>
//       </div>
    
//   );
// }

// export default Login;