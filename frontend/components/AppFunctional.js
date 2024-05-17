import React from 'react'
import { useState } from 'react'
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [steps, setSteps] = useState(initialSteps)
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail);
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  function getXY() {
    // It is not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getXYMessage() {
    // It is not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setCurrentIndex(initialIndex)
    setSteps(initialSteps)
    setMessage(initialMessage)
    setEmail(initialEmail)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let nextIndex;
    if (direction === 'left') {
      nextIndex = currentIndex % 3 !== 0 ? currentIndex - 1 : currentIndex
    } else if (direction === 'right') {
      nextIndex = currentIndex % 3 !== 2 ? currentIndex + 1 : currentIndex
    } else if (direction === 'up') {
      nextIndex = currentIndex >= 3 ? currentIndex - 3 : currentIndex
    } else if (direction === 'down') {
      nextIndex = currentIndex < 6 ? currentIndex + 3 : currentIndex
    } else {
      nextIndex = currentIndex
    }
    return nextIndex
  }

  function move(direction) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const nextIndex = getNextIndex(direction)
    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex)
      setSteps(steps + 1)
      setMessage('')
    } else {
      setMessage(`You can't go ${direction}`)
    }
  }

  function sendDataToServer() {
    // Prepare the data object to send to the server
    const data = {
      email: email,
      steps: steps,
      x: (currentIndex % 3) + 1,
      y: Math.floor(currentIndex / 3) + 1
    }

    // Send a POST request to the server using Axios
    axios.post('http://localhost:9000/api/result', data)
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(error => {
        setMessage(error.response.data.message)
      })
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault() // Prevent the default form submission behavior
    sendDataToServer()
    setEmail('')
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({(currentIndex % 3) + 1}, {(Math.floor(currentIndex / 3)) + 1})</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === currentIndex ? ' active' : ''}`}>
              {idx === currentIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move('left')}>LEFT</button>
        <button id="up" onClick={() => move('up')}>UP</button>
        <button id="right" onClick={() => move('right')}>RIGHT</button>
        <button id="down" onClick={() => move('down')}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
