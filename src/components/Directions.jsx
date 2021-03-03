import React from 'react'

export default function Directions({help}) {
    
    const onclick = () =>{
        help.setHelpMenu(false)
    }

    return (
        <div className='directions'>
            <h3><span>Objective:</span> Outlast 3 other players by avoiding tails and the outer wall.</h3>
            <p><span>Movement:</span> To move press any of the four arrow keys.</p>
            <p><span>Starting:</span> First press a key to choose a direction.</p>
            <p><span>There are two ways to start the game.</span></p>
            <p><span>First,</span> If four players all choose a direction the game begins.</p>
            <p><span>Second,</span> If there arent four players clicked the "Force Start" button.</p>
            <p>Make sure you choose your direction before you "Force Start" a game!</p>
            <button onClick={onclick}>Close</button>
        </div>
    )
}
