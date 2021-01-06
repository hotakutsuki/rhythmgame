import React, { Component } from "react"
import './Soundclass.css';
import clickmp3 from './audio/sound1.mp3'
import song from './audio/Tunnel.ogg'
import intro from './audio/TunnelO.ogg'
import wNoise from './audio/wnoise.mp3'
import hand from './images/download.png'
import mad1 from './images/mad/mad1.png'
import mad2 from './images/mad/mad2.png'
import hap1 from './images/hap/hap1.png'
import hap2 from './images/hap/hap2.png'
import hap3 from './images/hap/hap3.png'
import bgi1 from './images/backgrounds/1.jpg'
import bgi2 from './images/backgrounds/2.jpeg'
import bgi3 from './images/backgrounds/3.jpeg'
import bgi4 from './images/backgrounds/4.jpeg'
import bgi5 from './images/backgrounds/5.jpeg'
import bgi6 from './images/backgrounds/6.jpeg'
import bgi7 from './images/backgrounds/7.jpeg'
import bgi8 from './images/backgrounds/8.jpeg'
import bgi9 from './images/backgrounds/9.jpeg'
import bgi10 from './images/backgrounds/10.jpg'
import bgi11 from './images/backgrounds/11.jpg'
import tunnel from './images/tunnel.png'
let isBeingPress;

let audio;
let songAudio;
let introAudio;
let wNoiseAudio;
const beatDuration = 588;
const introAudioDuration = 8 * beatDuration
let songPlayedTimes = 1;
let startDate;
let intervalGame;
let timeToCheckpoint// = parseInt(Math.random() * 3500) + 500;
let debugMode = true;
let backgrounds = [bgi1, bgi2, bgi3, bgi4, bgi5, bgi6, bgi7, bgi8, bgi9, bgi10, bgi11]
let choosenBackgroundImg = backgrounds[1]
let hapImages = [hap1, hap2, hap3]
let choosenHapIm = hapImages[0];
let madImages = [mad1, mad2]
let choosenMadIm = madImages[0];
let brigthness=''
// var moveImageKeyframes = keyframes`
//     0% { transform: translate(0,0); }
//     100% { transform: translate(-30%,0); }
// `;

// const BackgroundImage = styled.img`
//   animation: ${moveImageKeyframes} 16s linear infinite;
// `

// var tunnelKeyFrames = keyframes`
//     0% { transform: translate(20%,0); }
//     100% { transform: translate(-100%,0); }
// `;

// let TunnelBackgroundImage = styled.img`
//   animation: ${tunnelKeyFrames} ${timeToCheckpoint+200}ms linear;
// `

const initialState = {
  miliseg: 0,
  section: 0,
  fillColor: 'red',
  success: true,
  hasbeenpressed: true,
  beatState: 'red',
  pressedState: 'green',
  readyForNextCycle: false,
  state: 'start',
  inTunnel: false
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

    wNoiseAudio = new Audio();
    wNoiseAudio.src = wNoise
    wNoiseAudio.volume = 0
    wNoiseAudio.addEventListener('ended', function () {
      wNoiseAudio.currentTime = 0;
      this.play();
    }, false);
  }


  init() {
    wNoiseAudio.play()
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
            if (this.state.miliseg % beatDuration < 120 || this.state.miliseg % beatDuration > beatDuration - 120) {
              if (this.state.miliseg % beatDuration < 50 || this.state.miliseg % beatDuration > beatDuration - 50) {
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

            if (this.state.beatState === 'red' && !this.state.hasbeenpressed && this.state.section > 0 && !debugMode) {
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

    this.loopTunnel()

    setInterval(() => {
      choosenHapIm = hapImages[Math.floor(Math.random()*hapImages.length)]
      choosenMadIm = madImages[Math.floor(Math.random()*madImages.length)]
    }, 250);
  }

  loopTunnel(){
    timeToCheckpoint = parseInt(Math.random() * 16000) + 2000
    setTimeout(() => {
      timeToCheckpoint = parseInt(Math.random() * 4500) + 1000
      console.log('timeToCheckpoint',timeToCheckpoint)
      this.setState({inTunnel: true})
      // var element = document.getElementById("tunnelBackgroundimage")
      // var newElm = element.cloneNode(true)
      // element.parentNode.replaceChild(newElm, element);
      // console.log(element)
      setTimeout(() => {
        wNoiseAudio.volume = 0.03
        songAudio.volume = 0.2
        brigthness='-dark'
        setTimeout(() => {
          setTimeout(() => {
            this.reloadBackgroundAnimation()  
          }, 100);
        }, timeToCheckpoint*.85);
        setTimeout(() => {
          this.setState({inTunnel: false})
          songAudio.volume = 1
          wNoiseAudio.volume = 0
          brigthness=''
          this.loopTunnel()
        }, timeToCheckpoint);
      }, 300);
    }, timeToCheckpoint)
  }

  reloadBackgroundAnimation(){
    var element = document.getElementById("backgroundimage");
    var newElm = element.cloneNode(true)
    choosenBackgroundImg = backgrounds[Math.floor(Math.random()*backgrounds.length)]
    newElm.src = choosenBackgroundImg
    element.parentNode.replaceChild(newElm, element);
  }

  showGameOver() {
    songAudio.pause()
    songAudio.currentTime = 0
    wNoiseAudio.pause()
    wNoiseAudio.currentTime = 0
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
            if (!debugMode){
              this.setState({
                pressedState: 'red',
                hasbeenpressed: false,
                success: false,
                state: 'gameover'
              })
              this.showGameOver()
            }
            break
          default:
        }
      }
    }
  }

  formatNumber = (num, size) => {
    var s = "000000000" + num;
    return s.substr(s.length-size);
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
          <span>
            <img id='backgroundimage' src={choosenBackgroundImg} className="background-image" alt="logo"/>
              {/* <BackgroundImage id='backgroundimage' src={choosenBackgroundImg} className="background-image"/> */}
              {this.state.inTunnel
              ? <img src={tunnel} className="background-tunnel" style={{animationDuration: timeToCheckpoint+300+"ms"}} alt="logo"/>
              // <TunnelBackgroundImage id='tunnelBackgroundimage' src={tunnel} className="background-tunnel"/>
              : <div/>}
            {this.state.pressedState === 'green'
              ? <img src={choosenHapIm} className={`full-screen-image${brigthness}`}  alt="logo" />
              : <img src={choosenMadIm} className={`full-screen-image${brigthness}`} alt="logo" />}
            <div className="canvas">
                Distance: {this.formatNumber(this.state.miliseg, 10)} m &nbsp; 
                {this.state.beatState === 'green'
                ? <svg width="16" height="16"> <circle cx="8" cy="8" r="8" fill={this.state.beatState} /> </svg>
                : <svg width="16" height="16"> <circle cx="8" cy="8" r="8" fill={'pink'} /> </svg>} 
            </div >
            <div className="canvas-background">
              <svg width="500" height="50" fill={'pink'}>
                <rect x="0" y="0" rx="20" ry="20" width="500" height="50" />
              </svg>
            </div>
                {/* <br />beats: {this.state.section} */}
                <div className={this.state.success ? "App-success" : "App-fail"}>
                    {/* state: */}
                    {/* {this.state.inTunnel? 'in Tunnel' : 'landscape'} */}
                  {/* {this.state.pressedState} */}
                  {/* <span style={{
                    color: this.state.success ? this.state.pressedState === 'green' ? 'green' : 'yellow' : 'red'}}>
                    <h1> {this.state.success ? this.state.pressedState === 'green' ? "GREAT!" : "OK" : "FAIL"} </h1>
                  </span> */}
                </div>
          </span>
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

