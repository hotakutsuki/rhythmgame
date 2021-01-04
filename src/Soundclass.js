///multiples audios

import React, { Component } from "react"
import './Soundclass.css';
import clickmp3 from './audio/sound1.mp3'
import song from './audio/Tunnel.ogg'
import intro from './audio/TunnelO.ogg'
import hand from './images/download.png'

let isBeingPress;

let audio;
let songAudio;
let introAudio;
const beatDuration = 588;
const introAudioDuration = 8 * beatDuration
let songPlayedTimes = 1;
let startDate;
let intervalGame;
const initialState = {
  miliseg: 0,
  section: 0,
  fillColor: 'red',
  success: true,
  hasbeenpressed: true,
  beatState: 'red',
  pressedState: 'red',
  readyForNextCycle: false,
  state: 'start',
}

function handleClick() {
  introAudio.play().then(() => {
    window.helloComponent.init();
  })
}

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = initialState
  }

  componentDidMount() {
    window.helloComponent = this;
    document.addEventListener("keydown", this.handleEvent, false);
    document.addEventListener("keyup", this.handleUpKey, false);

    audio = new Audio();
    audio.src = clickmp3;

    songAudio = new Audio();
    songAudio.src = song

    introAudio = new Audio();
    introAudio.src = intro
  }


  init() {
    this.setState(initialState)
    this.setState({ state: 'intro' })
    const startIntroDateDate = new Date()
    console.log('startIntroDateDate:', startIntroDateDate.getTime())
    songAudio.play().then(() => {
      //Prepare the song
      songAudio.pause()
      const songIsPreparedDate = new Date()
      const introDelay = introAudioDuration - (songIsPreparedDate - startIntroDateDate)
      console.log('intro Delay', introDelay)
      //play at the time
      setTimeout(() => {
        songAudio.play().then(() => {
          this.setState({ state: 'playing' })
          startDate = new Date()
          console.log('start time:', startDate.getTime())
          //game running
          intervalGame = setInterval(() => {
            if (this.state.miliseg / (64 * beatDuration) > songPlayedTimes) {
              songPlayedTimes++;
              songAudio.currentTime = (this.state.miliseg / (64 * beatDuration)) / 1000
            }
            // if (this.state.miliseg % beatDuration < 5) {
            //   audio.play();
            // }
            const presentDate = new Date()
            const delta = presentDate.getTime() - startDate.getTime()
            if (this.state.miliseg % beatDuration < 100 || this.state.miliseg % beatDuration > beatDuration - 100) {
              if (this.state.miliseg % beatDuration < 40 || this.state.miliseg % beatDuration > beatDuration - 40) {
                this.setState({
                  beatState: 'green'
                })
              } else {
                this.setState({
                  beatState: 'yellow'
                })
              }
            } else {
              this.setState({
                beatState: 'red'
              })
            }

            if (this.state.beatState === 'red' && !this.state.hasbeenpressed && this.state.section > 0) {
              this.setState({
                success: false,
                playing: 'gameover'
              })
              this.showGameOver()
            }
            if (this.state.beatState === 'red' && this.state.hasbeenpressed) {
              this.setState({
                readyForNextCycle: true,
              })
            }
            if (this.state.readyForNextCycle && this.state.beatState === 'yellow' && this.state.hasbeenpressed) {
              this.setState({
                hasbeenpressed: false,
                readyForNextCycle: false,
              })
            }
            this.setState(
              {
                miliseg: delta,
                section: parseInt(this.state.miliseg / beatDuration),
                fillColor: this.state.isBeatTime ? 'green' : 'red'
              })
          }, 1)
        })
      }, introDelay)
    })
  }

  showGameOver() {
    songAudio.pause()
    songAudio.currentTime = 0
    console.log(this.state.section)
    clearInterval(intervalGame)
    this.setState({
      state: 'gameover',
    })
  }

  handleUpKey = (event) => {
    isBeingPress = false
  }

  handleEvent = (event) => {
    if (!isBeingPress && event.key === ' ') {
      isBeingPress = true
      audio = new Audio(clickmp3)
      audio.play()
      console.log(this.state.miliseg - beatDuration * this.state.section)
      if (this.state.state === 'playing') {
        switch (this.state.beatState) {
          case 'green':
            this.setState({
              pressedState: 'green',
              hasbeenpressed: true
            })
            break
          case 'yellow':
            this.setState({
              pressedState: 'yellow',
              hasbeenpressed: true
            })
            break
          case 'red':
            this.setState({
              pressedState: 'red',
              hasbeenpressed: false,
              success: false,
              state: 'gameover'
            })
            this.showGameOver()
            break
          default:
        }
      }
    }
  }

  render() {
    switch (this.state.state) {
      case 'start':
        return (
          <header className="App-header">
            <div>
              <img src={hand} border="0" className="hand1" alt="logo" />
              <img src={hand} border="0" className="hand2" alt="logo" />
            </div>
            <button
              onClick={() => handleClick()}>
              Start!
              </button>
          </header>
        )
      case 'intro':
      case 'playing':
        return (
          <div className="App">
            <header className="App-header">
              <div className={this.state.success ? "App-success" : "App-fail"}>
                {this.state.pressedState}
                <span style={{
                  color: this.state.success ? this.state.pressedState === 'green' ? 'green' : 'yellow' : 'red'
                }}>
                  <h1> {this.state.success ? this.state.pressedState === 'green' ? "GREAT!" : "OK" : "FAIL"} </h1>
                </span>
              </div>
              <svg width="100" height="100">
                <circle cx="50" cy="50" r="40" fill={this.state.beatState} />
              </svg><br />
              <br />metros: {this.state.miliseg}
              <br />beats: {this.state.section}
            </header>
          </div >
        )
      case 'gameover':
        return (
          <header className="App-header">
            <button
              onClick={() => handleClick()}>
              Start!
              </button>
          </header>
        )
      default:
        return null
    }
  }
}

