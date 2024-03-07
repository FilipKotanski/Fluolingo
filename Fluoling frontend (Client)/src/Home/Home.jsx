import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap'; 
import "./Home.css";
import Img from "../../public/flamingo-logo.svg";

function Home() {
  return (
    <div>
      <div className="logo">
        <img src={Img} alt="Logo" />
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
