import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import App from "../MultiChoiceGame/MultiChoice";
import { useParams,useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import ImageGuessMode from '../ImageGuessGame/imageguessmode';

function Dashboard({ user }) {
    const [selectedGame, setSelectedGame] = useState(null);
    const [showMessage, setShowMessage] = useState(true);
    const location = useLocation();
    const { state } = location;
    const userName = state?.userName;
    const [count, setCount] = useState(0);
    const { email } = useParams();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/users/dashboard', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/users/login';
                } else {
                    throw new Error('Failed to fetch user data');
                }
            } else {
                const responseData = await response.json();
                // const redirectUrl = responseData.redirect;
                // const userEmail = responseData.userEmail;
                // const url = responseData.url;

                // console.log(url);
                // console.log(userEmail);
                // console.log(email);

                // const urlSegments = redirectUrl.split('/');

                // console.log(urlSegments.length)

                // if (email !== userEmail) {
                //     setCount(count + 1);
                //     window.location.href = redirectUrl;
                // }

              navigate("/users/dashboard");

            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // const handleGameSelection = (game) => {
    //     setSelectedGame(game);
    //     setShowMessage(false);
    // };

    const handleGameSelection = (game) => {
      setShowMessage(false);
      if (game === 'Image Guess') {
          navigate('/image-guess-mode'); // Use navigate function to redirect
      } else if (game === 'MultiChoice Quiz') {
          navigate('/multi-choice'); // Use navigate function to redirect
      }
  };



    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/users/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to logout');
            }

            const responseData = await response.json();

            if (responseData.success) {
                window.location.href = responseData.redirect;
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div>
            <div className="logo">
                <img src="/flamingo-logo.svg" alt="Logo" />
            </div>
            {showMessage && <div><h1>Hello {email}. Welcome to Fluolingo!</h1>
                <p>Select a language game:</p>
                <div>
                    <button className="g-button" onClick={() => handleGameSelection('Image Guess')}>Image Guess</button>
                    <button className="g-button" onClick={() => handleGameSelection('MultiChoice Quiz')}>MultiChoice Quiz</button>
                </div>
                <a href="#" onClick={handleLogout}>Logout</a>
            </div>}
            {/* <div>
                {selectedGame === 'Image Guess' && <ImageGuessMode />}
                {selectedGame === 'MultiChoice Quiz' && <App />}
            </div> */}
        </div>
    );
}

export default Dashboard;
