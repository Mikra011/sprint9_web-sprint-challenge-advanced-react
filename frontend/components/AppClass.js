import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default class AppClass extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    }
  }

  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    })
  }

  getNextIndex = (direction) => {
    const { index } = this.state
    let nextIndex;
    if (direction === 'left') {
      nextIndex = index % 3 !== 0 ? index - 1 : index
    } else if (direction === 'right') {
      nextIndex = index % 3 !== 2 ? index + 1 : index
    } else if (direction === 'up') {
      nextIndex = index >= 3 ? index - 3 : index
    } else if (direction === 'down') {
      nextIndex = index < 6 ? index + 3 : index
    } else {
      nextIndex = index
    }
    return nextIndex
  }

  move = (direction) => {
    const { index, steps } = this.state
    const nextIndex = this.getNextIndex(direction)
    if (nextIndex !== index) {
      this.setState({
        index: nextIndex,
        steps: steps + 1,
        message: '',
      })
    } else {
      this.setState({
        message: `You can't go ${direction}`,
      })
    }
  }

  sendDataToServer = () => {
    const { email, steps, index } = this.state
    const data = {
      email: email,
      steps: steps,
      x: (index % 3) + 1,
      y: Math.floor(index / 3) + 1,
    }

    axios
      .post('http://localhost:9000/api/result', data)
      .then((response) => {
        this.setState({
          message: response.data.message,
        })
      })
      .catch((error) => {
        this.setState({
          message: error.response.data.message,
        })
      })
  }

  onChange = (evt) => {
    this.setState({
      email: evt.target.value,
    })
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    this.sendDataToServer()
    this.setState({
      email: '',
    })
  }

  render() {
    const { className } = this.props;
    const { index, steps, message, email } = this.state
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates ({(index % 3) + 1}, {(Math.floor(index / 3)) + 1})</h3>
          <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>LEFT</button>
          <button id="up" onClick={() => this.move('up')}>UP</button>
          <button id="right" onClick={() => this.move('right')}>RIGHT</button>
          <button id="down" onClick={() => this.move('down')}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={email}
            onChange={this.onChange}
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
