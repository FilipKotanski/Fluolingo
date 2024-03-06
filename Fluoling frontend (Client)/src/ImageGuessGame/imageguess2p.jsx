// External import
import React, { useState, useEffect } from 'react';
import { Link , useNavigate } from 'react-router-dom';
// import Countdown from 'react-countdown';

// Local import
import './imageguess.css'
import LetterTile from './lettertiles'; 

//import enWordArr from '../words(en)';


// GIPHY API Key
const APIkey = 'caailYVBDQ7hpb4Ls9S49MSR0NrCdykg';


// Bug notes:
// 'Beer' as a query term has shown a picture of a deer 


function ImageGuess2p() {


    const navigate = useNavigate();

    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    console.log(isAuthenticated);

    useEffect(() => {
      // Checking if user is not loggedIn
      if (!isAuthenticated) {
        navigate("/users/login");
      } else {
        navigate("/image-guess-2p");
      }
    }, [navigate, isAuthenticated]);


    const [currentWord, setCurrentWord] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [playerControl, setPlayerControl] = useState('hidden');
    const [startButton, setStartButton] = useState('Start');
    const [gameFeedback, setGameFeedback] = useState('');
    const [words, setWords] = useState([]);
    const [gameClock, setGameClock] = useState('hidden');
    const [timer, setTimer] = useState(60); 
    const [letterTiles, setLetterTiles] = useState([]);
    const [gameComment, setGameComment] = useState('');
    const [gameCommentText, setGameCommentText] = useState('Are you both ready?');

    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    const [scoreBoard, setScoreBoard] = useState(0);
    const [scoreBoardBox, setScoreBoardBox] = useState('hidden');
    const [scoreBoardPlayer1, setScoreBoardPlayer1] = useState(0);
    const [scoreBoardPlayer2, setScoreBoardPlayer2] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [scoreStyle1, setScoreStyle1] = useState('active');
    const [scoreStyle2, setScoreStyle2] = useState('inactive');



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



    // Game functions ---------------------------------------------*


    const startGame = () => {
        
        setPlayerControl('visible');
        setGameClock('visible');
        setGameCommentText("Let's Lingo")
        setStartButton('Restart');
        setTimer(60);
        setScoreBoard(0);
        setScoreBoardBox('visible');
        setCurrentPlayer(1);

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
            updateScore();

            const updatedTiles = letterTiles.map(tile => ({...tile, isGuessed: true }));
            setLetterTiles(updatedTiles);

            setTimeout(() => {
                // nextQuestion();
            showImage();
            setGameFeedback('');
            }, "2000");

        }   else {

            setGameFeedback("That's not lingo!")
            updateLetterTiles(newUserAnswer);
            switchTurn();
        };

    };


    const updateScore = () => {

        if (currentPlayer === 1) {
            setScoreBoardPlayer1(score => score + 1);
        }   else {
            setScoreBoardPlayer2(score => score + 1);
        }

    };

    const switchTurn = () => {

        setCurrentPlayer(prevPlayer => (prevPlayer === 1 ? 2 : 1));
        playerIndicator();
        
        setGameCommentText(() => {
            if (currentPlayer === 1) {
                return "Player 2"
            } else {
                return "Player 1"
            }
        })

    };

    const playerIndicator = () => {

        if (currentPlayer === 2) {
            setScoreStyle1('active')
            setScoreStyle2('inactive')
        } else if (currentPlayer === 1) {
            setScoreStyle2('active')
            setScoreStyle1('inactive')
        } else {
            setScoreStyle1('inactive')
            setScoreStyle2('inactive')
        }
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
        // Refresh the page
        navigate("/image-guess-mode");
    };


    return (

        <div className="gameMain">

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
                        <br />

                        <div className={scoreBoardBox}>

                            <div className={scoreStyle1}>Player 1 Score: {scoreBoardPlayer1}</div>
                            <div className={scoreStyle2}>Player 2 Score: {scoreBoardPlayer2}</div>

                        </div>


                    </div>

                    <div id="playerControl" className={playerControl}>

                        <input id="playerInput" type="type" />
                        <button onClick={checkWord} id="answerSubmit">Enter</button>

                    </div>

                </div>
                
            </div>

            <button onClick={startGame} className="mt-5" >{startButton}</button>
            <button onClick={handleExit} className="mt-5">Exit Game</button>
        </div>
    );
}

export default ImageGuess2p;