
import React, { useState, useEffect } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuthentication } from '../Authentication/AuthenticationContext';

import { Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import "./Login.css";
import Img from "../../public/flamingo-logo.svg";

function Login() {

  const [renderDelayedContent, setRenderDelayedContent] = useState(false);

  useEffect(() => {
    // Delay rendering of content for 1 second
    const timeoutId = setTimeout(() => {
      setRenderDelayedContent(true);
    }, 250);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array ensures useEffect runs only once



  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    console.log(isAuthenticated);

    useEffect(() => {
      // Checking if user is not loggedIn
      if (!isAuthenticated) {
        navigate("/users/login");
      } else {
        navigate("/users/dashboard");
      }
    }, [navigate, isAuthenticated]);



  const { login, errorMessage } = useAuthentication();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const location = useLocation();
  const { state } = location;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData); // Call login function from context
    // Redirect to dashboard if login successful
    // You can replace "/dashboard" with the appropriate path
    navigate('/users/dashboard');
  };

  const success = sessionStorage.getItem("success");

  
  return (
    <div>
      <div className="logo">
        <img src={Img} alt="logo" />

      {/* state?.successMessage && */}


      
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      </div>
      <h1 className="heading">Fluolingo</h1>
      { renderDelayedContent && success &&(
        <div className="success-message">
          <p>Successful registration. Please log in now.</p>
        </div>
      )}

      <Card className="rounded p-3">
        <h2>Welcome!</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>
          <div>
            <br />
          </div>
          <Button variant="primary" type="submit" className="g-button">
            Login
          </Button>
        </Form>

        <div>
          <br />
        </div>
        <p>Don't have an account? <Link to="/users/register">Register here</Link></p>
      </Card>
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