// External import
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// import Countdown from 'react-countdown';

// Local import
import './imageguess.css'
import LetterTile from './lettertiles'; 

//import enWordArr from '../words(en)';


// GIPHY API Key
const APIkey = 'caailYVBDQ7hpb4Ls9S49MSR0NrCdykg';


// Bug notes:
// 'Beer' as a query term has shown a picture of a deer 


function ImageGuess() {

    const navigate = useNavigate();
    const [currentWord, setCurrentWord] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [playerControl, setPlayerControl] = useState('hidden');
    const [startButton, setStartButton] = useState('Start');
    const [gameFeedback, setGameFeedback] = useState('');
    const [words, setWords] = useState([]);
    const [czechWords, setCzechWords] = useState([]);
    const [gameClock, setGameClock] = useState('hidden');
    const [timer, setTimer] = useState(20); 
    const [letterTiles, setLetterTiles] = useState([]);
    const [gameComment, setGameComment] = useState('');
    const [gameCommentText, setGameCommentText] = useState('Are you ready?');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    // let tiles = [];
    const [scoreBoard, setScoreBoard] = useState(0);
    const [scoreBoardBox, setScoreBoardBox] = useState('hidden');



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

    // useEffect(() => {
        
    //     fetch('http://localhost:4000/api/words/czech')
    //       .then(response => response.json())
    //       .then(data => {
    //         setCzechWords(data); //czechWords
    //       })
    //       .catch(error => {
    //         console.error('Error fetching words:', error);
    //       });
    // }, []);

    // useEffect(() => {
        
    //     fetch('http://localhost:4000/api/words/french')
    //       .then(response => response.json())
    //       .then(data => {
    //         console.log(data);
    //       })
    //       .catch(error => {
    //         console.error('Error fetching words:', error);
    //       });
    // }, []);

    // useEffect(() => {
        
    //     fetch('http://localhost:4000/api/words/turkish')
    //       .then(response => response.json())
    //       .then(data => {
    //         console.log(data);
    //       })
    //       .catch(error => {
    //         console.error('Error fetching words:', error);
    //       });
    // }, []);



    // Game functions ---------------------------------------------*

    const handleLanguageChange = (language) => {
      
        setSelectedLanguage(language);
    };


    const startGame = () => {
        
        setPlayerControl('visible');
        setGameClock('visible');
        setGameCommentText("Let's Lingo")
        setStartButton('Restart');
        setTimer(20);
        setScoreBoard(0);
        setScoreBoardBox('hidden');

        showImage();
        startTimer();
        
    };


    const showImage = () => {

        // console.log(words);
        console.log(randomWord);
        setCurrentWord(randomWord);

        const queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${APIkey}&q=${randomWord}&limit=1&offset=0&rating=g&lang=en&bundle=messaging_non_clips`;

        fetch(queryURL)

        .then((response) => 
            // return 
            response.json())
        .then((data) => {
        // console.log(data.data[0]['images']['original']['url']);
        setImageURL(data.data[0]['images']['original']['url']);
        });

        createLetterTiles();
        
    }


    const startTimer = () => {
        
        const intervalId = setInterval(() => {

            setTimer(prevTimer => {

                if (prevTimer > 0) {
                    return prevTimer - 1

                } else {
                    clearInterval(intervalId);
                    setPlayerControl('hidden');
                    setGameCommentText("Game Over")
                    // gameOver();
                }       
            });
        }, 1000);

    };


    const checkWord = (event) => {

        // event.preventDefault();

        const userAnswer = document.getElementById('playerInput').value;
        const newUserAnswer = userAnswer.charAt(0).toUpperCase() + userAnswer.slice(1);

        // console.log(userAnswer);
        // console.log(newUserAnswer);

        if (newUserAnswer === currentWord) {

            setGameFeedback(currentWord + ' is correct!');
            setScoreBoardBox('visible');
            setScoreBoard(score => score + 1);

            const updatedTiles = letterTiles.map(tile => ({...tile, isGuessed: true }));
            setLetterTiles(updatedTiles);

            setTimeout(() => {
                // nextQuestion();
            showImage();
            setGameFeedback('');
            }, "2000");

        }   else {

            setGameFeedback('Try again!')
            updateLetterTiles(newUserAnswer);
        };

    };


    const createLetterTiles = () => {

        // console.log(randomWord);

        const newTiles = randomWord.split('').map((letter, index) => ({

            id: index,
            letter,
            isGuessed: false,

        }));

        console.log(newTiles);
        setLetterTiles(newTiles);

        // tiles.forEach(tile => {
        //     console.log(tile.letter)
        // });

        // setLetterTiles(tiles);
 
    };


    const updateLetterTiles = (userAnswer) => {

        const updatedTiles = letterTiles.map(tile => ({...tile, isGuessed: userAnswer.charAt(tile.id) === tile.letter}));

        setLetterTiles(updatedTiles);

    };


    const handleExit = () => {
        
        navigate("/image-guess-mode");
    };


    return (

        <div className="gameMain">

            <img src="../public/flamingo-logo.svg" alt="Fluolingo Logo" className="logo mb-5" />
            {/* <h1 className="heading">Fluolingo</h1> */}

            <div className="mb-5">
                <h3>Choose your language:</h3>
                <button className={`language-button ${selectedLanguage === 'english' ? 'selected' : ''}`} onClick={() => handleLanguageChange('english')}>English</button>
                <button className={`language-button ${selectedLanguage === 'french' ? 'selected' : ''}`} onClick={() => handleLanguageChange('french')}>French</button>
                <button className={`language-button ${selectedLanguage === 'czech' ? 'selected' : ''}`} onClick={() => handleLanguageChange('czech')}>Czech</button>
                <button className={`language-button ${selectedLanguage === 'turkish' ? 'selected' : ''}`} onClick={() => handleLanguageChange('turkish')}>Turkish</button>
            </div>


            <h1 className={gameComment}>{gameCommentText}</h1>


            <div id="gameBox" className="mt-5">

                <div id="gameClock" className={gameClock}>
                    {/* <Countdown date={Date.now() + 10000} renderer={countDown} /> */}
                    {timer} 
                </div>

                <div id="imageBox" className="mt-3">
                    {imageURL && <img src={imageURL} alt="Giphy" />}
                </div>

                {/* <div id="wordBox">{currentWord}</div> */}

                <div id="letterTiles" className="letterTiles">

                    {letterTiles.map(({ id, letter, isGuessed }) => (
                        <LetterTile key={id} letter={isGuessed ? letter : ' '} isGuessed={isGuessed} />
                    ))}
                    
                </div>

                <div id="guessBox" className="mt-3">

                    <div className="gameFeedback my-3">

                        {gameFeedback}

                        <div className={scoreBoardBox}>
                            Lingo Score: {scoreBoard}
                        </div>


                    </div>

                    <div id="playerControl" className={playerControl}>

                        <input id="playerInput" type="type" />
                        <button onClick={checkWord} id="answerSubmit">Enter</button>

                    </div>

                </div>
                
            </div>

            <button onClick={startGame} className="mt-5 restartButton" >{startButton}</button>
            <button onClick={handleExit} className="mt-5 exitButton">Exit Game</button>
        </div>
    );
}

export default ImageGuess;