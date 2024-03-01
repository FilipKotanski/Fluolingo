import React, { useState, useEffect } from 'react';
import './imageguess.css'

const APIkey = 'caailYVBDQ7hpb4Ls9S49MSR0NrCdykg';

function ImageGuess() {
    // State variables
    const [currentWord, setCurrentWord] = useState(''); // The current word to guess
    const [imageURL, setImageURL] = useState(''); // The URL of the image to display
    const [playerControl, setPlayerControl] = useState('hidden'); // Controls the visibility of the player input
    const [startButton, setStartButton] = useState('Start'); // The text of the start button
    const [gameFeedback, setGameFeedback] = useState(''); // Feedback message to the player
    const [words, setWords] = useState([]); // The list of words to guess

    // Fetch the list of words from the server when the component mounts
    useEffect(() => {
        fetch('http://localhost:4000/api/words/english')
            .then(response => response.json())
            .then(data => {
                setWords(data);
            })
            .catch(error => {
                console.error('Error fetching words:', error);
            });
    }, []);

    // Start a new game
    const startGame = () => {
        // Choose a random word from the list
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];

        // Update the state with the new word
        setCurrentWord(randomWord);
        setPlayerControl('visible');
        setStartButton('Restart');

        // Fetch an image for the word from the Giphy API
        const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${APIkey}&q=${randomWord}&limit=1&offset=0&rating=g&lang=en&bundle=messaging_non_clips`;

        fetch(queryURL)
            .then(response => response.json())
            .then(data => {
                // Update the state with the new image URL
                setImageURL(data.data[0]['images']['original']['url']);
            });
    };

    // Check the player's guess
    const checkWord = () => {
        const userAnswer = document.getElementById('playerInput').value;

        if (userAnswer === currentWord) {
            // If the guess is correct, show a success message and start a new game after 2 seconds
            setGameFeedback(currentWord + ' is correct!');
            setTimeout(() => {
                startGame();
                setGameFeedback('');
            }, "2000");
        } else {
            // If the guess is incorrect, show an error message
            setGameFeedback('Try again!')
        };
    };

    // Render the game UI
    return (
        <div className="gameMain">
            <h1 className="mb-5">Let the games begin...</h1>
            <div id="gameBox">
                <div id="imageBox">
                    {imageURL && <img src={imageURL} alt="Giphy" />}
                </div>
                <div id="guessBox" className="mt-5">
                    <div className="gameFeedback my-5">
                        {gameFeedback}
                    </div>
                    <div id="playerControl" className={playerControl}>
                        <input id="playerInput" type="type" />
                        <button onClick={checkWord} id="answerSubmit">Enter</button>
                    </div>
                </div>
            </div>
            <button onClick={startGame} className="mt-5">{startButton}</button>
        </div>
    );
}

export default ImageGuess;


