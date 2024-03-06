import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import "./Home.css";

function Home() {
  return (
    <div>
      <div className="logo">
        <img src="../public/flamingo-logo.svg" alt="Logo" />
      </div>
      <h1 className="heading">Fluolingo</h1>
      <p>Welcome to Fluolingo!</p>
      <Link to="/users/login">
        <Button variant="primary" className="g-button">Login</Button>  
      </Link>
    </div>
  );
}

export default Home;
