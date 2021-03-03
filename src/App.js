import React, {useState, useEffect} from 'react';
import io from 'socket.io-client'
import NavBar from './components/NavBar'
import Confetti from './components/Confetti'
import WinnerModal from './components/WinnerModal'
import Directions from './components/Directions';
import './App.css';
// const url = 'https://snake-online-serve.herokuapp.com/'
const url = 'localhost:8000'
const socket = io.connect(url);
function App() {
  const [userId, setUserId] = useState()
  const [winningConfetti, setWinningConfetti] = useState(false)
  const [helpMenu, setHelpMenu] = useState(false)
  
  let toggle = document.querySelector('#toggle')
  let interval
  const isToggle = () => {
    if(toggle)toggle.classList.toggle('toggle')
  }
  if(winningConfetti === true){
    interval = setInterval(isToggle, 200)
  }
  if(winningConfetti === false){
    clearInterval(interval)
  }

  useEffect(() => {
    document.addEventListener('keydown', (key) => setUserDirection(key))
    const setUserDirection = (key) => {
      if([37, 38, 39, 40].indexOf(key.keyCode) > -1) {
        key.preventDefault();
        if(winningConfetti === true){
          setWinningConfetti(false)
        }
      }
      // console.log(key.keyCode, direction)
      socket.emit('player direction', JSON.stringify({userId: userId, direction: key.keyCode})).once()
    }

    const handleDirection = (headSnake, res) =>{
      //might render funny cause react renders a billion times
      if(res.direction === 37){
        headSnake.style.borderRadius=  '50% 0 0 50%';
      } else if(res.direction === 38){
        headSnake.style.borderRadius=  '50% 50% 0 0';
      } else if(res.direction === 39){
        headSnake.style.borderRadius=  '0 50% 50% 0';
      } else if(res.direction === 40){
        headSnake.style.borderRadius=  '0 0 50% 50%';
      }
    }

    socket.on('setId', ()=> {
      setUserId(socket.id)
    })

    socket.on('game-start', (result)=> {
      if(helpMenu === true){setHelpMenu(false)}
      let res = JSON.parse(result)
      //game logic here...
      let tempColor = ['red', 'blue', 'orange', 'purple']
      const board = document.querySelector('.board')

      for(let i = 0; i < res.length; i++){
          const headSnake = document.createElement('div')
          headSnake.className = 'head'
          headSnake.style.background = tempColor[i]
          headSnake.style.top = `${(600 / 56) * res[i].y}px`
          headSnake.style.left = `${(711 / 64) * res[i].x}px`
          handleDirection(headSnake, res[i])
          board.appendChild(headSnake)
      }
    })

    socket.on('gameOver', (result)=> {
      // reset FE board now
      let res = JSON.parse(result)
      console.log('gameOver response: ', res)
      for(let i = 0; i < res.winner.length; i++){
        if(socket.id === res.winner[i]){
          setWinningConfetti(true)
        }
      }
      setTimeout(() => {
        //remove old appended head class.
        let removingOldSnakeHead = document.querySelectorAll('.head')
        removingOldSnakeHead.forEach((each) => {each.parentNode.removeChild(each)})
        //draw start snake
        const board = document.querySelector('.board')
        let tempColor = ['red', 'blue', 'orange', 'purple']
        for(let i = 0; i < res.players.length; i++){
          const headSnake = document.createElement('div')
          headSnake.className = 'head'
          headSnake.style.background = tempColor[i]
          headSnake.style.top = `${(600 / 56) * res.players[i].y}px`
          headSnake.style.left = `${(711 / 64) * res.players[i].x}px`
          handleDirection(headSnake, res.players[i])
          board.appendChild(headSnake)
        }
      }, 3000)
    })
  })

  const forceStart = () => {
    socket.emit('initNewGame', true)
  }

  const isHelp= () => {
    if(helpMenu === false){
      setHelpMenu(true)
    } else {
      setHelpMenu(false)
    }
  }

  return (
    <div className="App">
      <NavBar />
      <div className='btnGroup'>
        <button onClick={isHelp}>Game directions</button>
        <button onClick={forceStart}>Force Start</button>
      </div>
      <div className='board'></div>
      {winningConfetti === true && <Confetti />}
      {winningConfetti === true && <WinnerModal />}
      {helpMenu === true && <Directions help={{helpMenu: helpMenu, setHelpMenu: setHelpMenu}}/>}
    </div>
  );
}

export default App;
