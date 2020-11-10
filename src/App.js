import React, {useState, useEffect} from 'react';
import io from 'socket.io-client'
import NavBar from './NavBar'
import './App.css';
const url = 'https://snake-online-serve.herokuapp.com/'
// const url = 'localhost:8000'
const socket = io.connect(url);
function App() {
  const [userId, setUserId] = useState()

  useEffect(() => {
    document.addEventListener('keydown', (key) => setUserDirection(key))
    
    const setUserDirection = (key) => {
      // console.log(key.keyCode, direction)
      // console.log('keyyy',key)
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

    socket.on('setId', (res)=> {
      setUserId(socket.id)
      console.log('players response: ', socket.id, JSON.parse(res))
    })

    socket.on('game-start', (result)=> {
      let res = JSON.parse(result)
      //game logic here...
      let tempColor = ['red', 'blue', 'orange', 'purple']
      const board = document.querySelector('.board')

      for(let i = 0; i < res.length; i++){
          // const playerSnake = document.createElement('div')
          const headSnake = document.createElement('div')
          headSnake.className = 'head'
          headSnake.style.background = tempColor[i]
          headSnake.style.top = `${(600 / 56) * res[i].y}px`
          headSnake.style.left = `${(711 / 64) * res[i].x}px`
          handleDirection(headSnake, res[i])
          board.appendChild(headSnake)
          // console.log(headSnake)

        // if(res[i].userId === socket.id){
          // playerSnake.className = `snake${i+1}`
          // playerSnake.style.top = `${(600 / 56) * res[i].y}px`
          // playerSnake.style.left = `${(711 / 64) * res[i].x}px`
          // board.appendChild(playerSnake)
        // }
      }
    })

    socket.on('gameOver', (result)=> {
      // reset FE board now
      let res = JSON.parse(result)
      console.log('gameOver response: ', res)
      let removingOldSnake1 = document.querySelectorAll('.snake1')
      let removingOldSnake2 = document.querySelectorAll('.snake2')
      let removingOldSnake3 = document.querySelectorAll('.snake3') 
      let removingOldSnake4 = document.querySelectorAll('.snake4')
      let removingOldSnakeHead = document.querySelectorAll('.head')
      removingOldSnake1.forEach((each) => {each.parentNode.removeChild(each)})
      removingOldSnake2.forEach((each) => {each.parentNode.removeChild(each)})
      removingOldSnake3.forEach((each) => {each.parentNode.removeChild(each)})
      removingOldSnake4.forEach((each) => {each.parentNode.removeChild(each)})
      removingOldSnakeHead.forEach((each) => {each.parentNode.removeChild(each)})
    })
  })

  const onclick = () => {
    socket.emit('initNewGame', true)
  }

  return (
    <div className="App">
      <NavBar />
      <div className='board'></div>
      <button onClick={onclick}>Force Start</button>
    </div>
  );
}

export default App;
