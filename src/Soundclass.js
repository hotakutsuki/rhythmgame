import React, { Component } from "react"
import firebase from './firebase.js' 
import './Soundclass.css';
import clickmp3 from './audio/sound1.mp3'
import song from './audio/Tunnel.ogg'
import intro from './audio/TunnelO.ogg'
import wNoise from './audio/wnoise.mp3'
import playIcon from './images/playicon.png'
import restartIcon from './images/restarticon.png'
import scoreIcon from './images/scoreicon.png'
import sendIcon from './images/sendicon.png'
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
import gameover from './images/gameover.png'
import gameoverText from './images/gameovericon.png'
import homeIcon from './images/homeicon.png'
import lhimage from './images/lh.png'
import rhimage from './images/rh.png'
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
let intervalImage;
let tunnelTimeout;
let timeToCheckpoint
let debugMode = false;
let backgrounds = [bgi1, bgi2, bgi3, bgi4, bgi5, bgi6, bgi7, bgi8, bgi9, bgi10, bgi11]
let choosenBackgroundImg = backgrounds[1]
let hapImages = [hap1, hap2, hap3]
let choosenHapIm = hapImages[0];
let madImages = [mad1, mad2]
let choosenMadIm = madImages[0];
let brigthness=''
let playerName

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
          this.loopTunnel()
          intervalImage = setInterval(() => {
            choosenHapIm = hapImages[Math.floor(Math.random()*hapImages.length)]
            choosenMadIm = madImages[Math.floor(Math.random()*madImages.length)]
          }, 250);

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
  }

  loopTunnel(){
    timeToCheckpoint = parseInt(Math.random() * 16000) + 2000
    tunnelTimeout = setTimeout(() => {
      timeToCheckpoint = parseInt(Math.random() * 4500) + 1000
      console.log('timeToCheckpoint',timeToCheckpoint)
      this.setState({inTunnel: true})
      tunnelTimeout = setTimeout(() => {
        wNoiseAudio.volume = 0.03
        songAudio.volume = 0.2
        brigthness='-dark'
        tunnelTimeout = setTimeout(() => {
          tunnelTimeout = setTimeout(() => {
            this.reloadBackgroundAnimation()  
          }, 100);
        }, timeToCheckpoint*.85);
        tunnelTimeout = setTimeout(() => {
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
    if (element!=null){
      var newElm = element.cloneNode(true)
      choosenBackgroundImg = backgrounds[Math.floor(Math.random()*backgrounds.length)]
      newElm.src = choosenBackgroundImg
      element.parentNode.replaceChild(newElm, element);
    }
  }

  showGameOver() {
    songAudio.pause()
    songAudio.currentTime = 0
    wNoiseAudio.pause()
    wNoiseAudio.currentTime = 0
    console.log(this.state.section)
    clearInterval(intervalGame)
    clearInterval(intervalImage)
    clearTimeout(tunnelTimeout)
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
      const element = document.getElementById('rightHand')
      if (element !== null){
        var newElm = element.cloneNode(true)
        element.parentNode.replaceChild(newElm, element);
      }
    }
  }

  formatNumber = (num, size) => {
    var s = "000000000" + num;
    return s.substr(s.length-size);
  }

  restartGame() {
    introAudio.play().then(() => {
      window.helloComponent.init();
    })
    songAudio.volume = 1
    wNoiseAudio.volume = 0
    brigthness=''
  }
  
  saveRecord(record){
    this.setState({
      state: 'default'
    })
    const date = new Date()
    firebase.firestore().collection("records").doc().set({
      name: playerName || 'def',
      record: record,
      date: date.getTime()
    }).then(() => {
      this.showRecordsScreen();
    }).catch((error) => {
      this.showRecordsScreen()
    });
  }
  
  setName (name){
    playerName = name
  }

  showRecordsScreen = () => {
    this.setState({
      state: 'default'
    })
    firebase.firestore().collection("records").orderBy("record", "desc").limit(10).get().then(querySnapshot => {
      let recs = []
      querySnapshot.docs.forEach(doc => {
        recs.push(doc.data())
      })
      this.setState({
        state: 'records',
        records: recs
      })
    })
  }

  render() {
    switch (this.state.state) {
      case 'start':
        return (
          <div className="App-header">
            <div style={{fontSize: 48, marginTop: -200}}>
              Keep up the pace!
            </div>
            <br/><br/>
            <div style={{fontSize: 28}}>
              Feel the music and use the <i><b>Space bar</b></i> to keep the beat for as long as you can
            </div>
            <br/><br/>
            <div style={{fontSize: 18}}>
              watch out for the tunnels
            </div>
            <div className="hands">
              <img src={lhimage} className="hand1" alt="logo"/>
              <img id="rightHand" width='100' src={rhimage} className="hand2" alt="logo"/>
            </div>
            <span className="canvas-start-background" onClick={this.restartGame}>
              <svg width="300" height="150" fill={'#795548'}>
                <rect x="0" y="0" rx="20" ry="20" width="300" height="150" />
              </svg>
              <img src={playIcon} className="canvas-button-icon" alt="logo"/>
            </span>
            <span className="canvas-score-background" onClick={this.showRecordsScreen}>
              <svg width="300" height="150" fill={'#607d8b'}>
                <rect x="0" y="0" rx="20" ry="20" width="300" height="150" />
              </svg>
              <img src={scoreIcon} className="canvas-button-icon" alt="logo"/>
            </span>
          </div>
        )
      case 'intro':
      case 'playing':
        return (
          <span>
            <img id='backgroundimage' src={choosenBackgroundImg} className="background-image" alt="logo"/>
              {this.state.inTunnel
              ? <img src={tunnel} className="background-tunnel" style={{animationDuration: timeToCheckpoint+300+"ms"}} alt="logo"/>
              : <div/>}
            {this.state.pressedState === 'green'
              ? <img src={choosenHapIm} className={`full-screen-image${brigthness}`}  alt="logo" />
              : <img src={choosenMadIm} className={`full-screen-image${brigthness}`} alt="logo" />}
            <div className="hands">
              <img src={lhimage} className="hand1" alt="logo"/>
              <img id="rightHand" src={rhimage} className="hand2" alt="logo"/>
            </div>
            <div className="App-background" style={{left: window.innerHeight*1.75}}/>
            <div className="canvas-background">
              <svg width="500" height="60" fill={'pink'}>
                <rect x="0" y="0" rx="20" ry="20" width="500" height="60" />
              </svg>
              <div className="canvas">
                Distance: {this.formatNumber(this.state.miliseg, 10)} m &nbsp; 
                {this.state.beatState === 'green'
                ? <svg width="16" height="16"> <circle cx="8" cy="8" r="8" fill={this.state.beatState} /> </svg>
                : <svg width="16" height="16"> <circle cx="8" cy="8" r="8" fill={'pink'} /> </svg>} 
              </div >
            </div>
                <div className={this.state.success ? "App-success" : "App-fail"}>
                </div>
          </span>
        )
      case 'gameover':
        return (
          <div>
            <img src={gameoverText} className="gameover-image" alt="logo"/>
            {this.state.inTunnel
              ? <img src={tunnel} className="background-tunnel" alt="logo"/>
              :<img src={choosenBackgroundImg} className="background-image-gameover" alt="logo"/>}
            <img src={gameover} className={`full-screen-image${brigthness}`} alt="logo"/>
            <div className="App-background" style={{left: window.innerHeight*1.75}}/>
            <div className="final-score-background">
              <svg width="350" height="80" fill={'#673ab7'}>
                <rect x="0" y="0" rx="20" ry="20" width="350" height="80" />
              </svg>
              <div className="canvas">
                Distance: {this.formatNumber(this.state.miliseg, 10)}m 
              </div >
            </div>
            <div className="final-score-input-background">
              <svg width="350" height="80" fill={'#8bc34a'}>
                <rect x="0" y="0" rx="20" ry="20" width="350" height="80" />
              </svg>
              <input className='final-score-input' placeholder="Your name..." maxLength='11' onChange={name => this.setName(name.target.value)} />
              <img src={sendIcon} className='send-button-icon' alt="logo" onClick={() => this.saveRecord(this.state.miliseg)}/>
            </div>
            <span className="canvas-start-background" onClick={this.restartGame}>
              <svg width="300" height="150" fill={'#795548'}>
                <rect x="0" y="0" rx="20" ry="20" width="300" height="150" />
              </svg>
              <img src={restartIcon} className="canvas-button-icon" alt="logo"/>
            </span>
            <span className="canvas-score-background" onClick={this.showRecordsScreen}>
              <svg width="300" height="150" fill={'#607d8b'}>
                <rect x="0" y="0" rx="20" ry="20" width="300" height="150" />
              </svg>
              <img src={scoreIcon} className="canvas-button-icon" alt="logo"/>
            </span>
          </div>
        )
      case 'records':
        return (
          <div className="record-page">
            <div style={{fontSize: 48}}>
              <table className="record-table">
                <tr style={{fontSize: 72}}>
                  <th>Players</th>
                  &nbsp;&nbsp;
                  <th>Scores</th>
                </tr>
                {this.state.records.map((record) => {
                  return (
                  <tr>
                    <th >{record.name}</th>
                    &nbsp;&nbsp;.....................................................................&nbsp;&nbsp;
                    <th >{this.formatNumber(record.record, 10)}</th>
                  </tr>
                  )}
                )}
              </table>
            </div>
            <span className="canvas-start-background" onClick={this.restartGame}>
              <svg width="300" height="150" fill={'#795548'}>
                <rect x="0" y="0" rx="20" ry="20" width="300" height="150" />
              </svg>
              <img src={playIcon} className="canvas-button-icon" alt="logo"/>
            </span>
            <span className="canvas-score-background" onClick={() => {this.setState({state:'start'})}}>
              <svg width="300" height="150" fill={'#607d8b'}>
                <rect x="0" y="0" rx="20" ry="20" width="300" height="150" />
              </svg>
              <img src={homeIcon} className="canvas-button-icon" alt="logo"/>
            </span>
          </div>
        )
      default:
        return <div>
          <div className="App-header">
            Loading...
          </div>
        </div>
    }
  }
}

