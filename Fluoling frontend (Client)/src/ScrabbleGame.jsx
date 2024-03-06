
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ScrabbleGame.css';

function ScrabbleGame() {
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [word, setWord] = useState({ player1: '', player2: '' });
  const [letters, setLetters] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const timerRef = useRef(null);

  useEffect(() => {
    generateLetters(7); // Generate 7 letters when the component mounts
    startTimer();
  }, []);

  const generateLetter = () => {
    const alphabet = 'aaaaaaaabccddddeeeeeeeeeeeeffgghhiiiiiiiiijkllllmmnnnnnnooooooooppqrrrrrrssssttttttuuvwxyz';
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  const generateLetters = (numLetters) => {
    let letters = [];
    for (let i = 0; i < numLetters; i++) {
      letters.push(generateLetter());
    }
    setLetters(shuffleArray(letters)); // Update the letters state
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(time => {
        if (time === 0) {
          switchPlayer();
          return 30;
        } else {
          return time - 1;
        }
      });
    }, 1000);
  };

  const switchPlayer = () => {
    setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
  };

  const handleInputChange = (e) => {
    if (e.target.name === currentPlayer) {
      setWord({ ...word, [e.target.name]: e.target.value });
    }
  };

  const verifyWord = async (word) => {
    const response = await axios.get(`https://api.datamuse.com/words?sp=${word}`);
    return response.data.some(item => item.word === word);
  };

  const handleRoundEnd = async () => {
    clearInterval(timerRef.current);
    const isPlayer1WordValid = await verifyWord(word.player1);
    const isPlayer2WordValid = await verifyWord(word.player2);

    if (isPlayer1WordValid) {
      setScore({ ...score, player1: score.player1 + word.player1.length });
    }
    if (isPlayer2WordValid) {
      setScore({ ...score, player2: score.player2 + word.player2.length });
    }

    setWord({ player1: '', player2: '' });
    generateLetters(7);
    setCurrentPlayer('player1');
    setTimeLeft(30);
    startTimer();
  };

  return (
    <main className="game-container">
      <header>
        <h1 className="title">Scrabble Game</h1>
        <div className="score-board">
          <h2 className="score">Score: Player 1 - {score.player1}, Player 2 - {score.player2}</h2>
          {score.player1 >= 10 && <h2 className="winner">Player 1 wins!</h2>}
          {score.player2 >= 10 && <h2 className="winner">Player 2 wins!</h2>}
        </div>
      </header>
  
      <section className="letters-section">
        <div className="letters-box">
          <h3 className="letters">Letters: {letters.join(', ')}</h3>
        </div>
      </section>
  
      <section className="game-controls">
        <h3 className="time-left">Time left: {timeLeft} seconds</h3>
        <h3 className="current-player">Current player: {currentPlayer}</h3>
        <input className="input" name="player1" value={word.player1} onChange={handleInputChange} placeholder="Player 1 word" />
        <input className="input" name="player2" value={word.player2} onChange={handleInputChange} placeholder="Player 2 word" />
        <button className="round-end-button" onClick={handleRoundEnd}>End Round</button>
      </section>
    </main>
  );
}

export default ScrabbleGame
