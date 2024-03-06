import React, { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import ImageGuess from './imageguess';
import Register from './Register/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Home from './Home/Home';
import MultiChoice from './components/MultiChoice';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  
  return (
    <Router>
      <div className={darkMode ? 'dark' : ''} style={{ height: "100%" }}>
        <div className="flex justify-end p-4">
          <button
            className="px-4 py-2 rounded-md bg-gray-700 text-white"
            onClick={toggleDarkMode}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div> 
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/multichoice" element={<MultiChoice />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/dashboard/:email?" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
