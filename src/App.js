import React, { Component } from 'react';
import Header from './components/Header';
import BotBox from './components/BotBox';
import Sockette from 'sockette';
import MarvelAPI from 'marvel-comics-api';
import secrets from './config/marvel-api';
import './App.css';
import { setInterval } from 'timers';
import _ from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);
    // Initializing websocket connection
    this.ws = new Sockette('ws://192.168.1.52:8995', {
      onopen: e => this.connectionOpened(e),
      onmessage: e => this.messageRecieved(e),
      onclose: e => this.connectionClosed(e),
      onerror: e => this.connectionError(e),
      onreconnect: e => this.reconnect(e)
    })
    this.state = {
      battleBots: [],
      intervalId: false,
      info: ""
    }
    this.images = {
      storage: [],
      loaded: false
    };
  }

  /**
   * Request an update to server
   */
  requestUpdate() { this.ws.send(JSON.stringify({ subject: "request" })); }

  /**
   * Triggered when websocket connection
   * starts
   * @param {Object} event 
   */
  connectionOpened(event) {
    console.log("Connection opened");
    this.requestUpdate()
    this.connectionIntervalRequest = setInterval(() => { this.requestUpdate() }, 60000);
    this.setState({ intervalId: this.connectionIntervalRequest })
  }

  /**
   * Retrieves incoming messages
   * from websocket connection
   * @param {Object} event 
   */
  messageRecieved(event) {
    if (event && event.data) {
      let data = JSON.parse(event.data);
      if (this.battleBots && this.battleBots.length > 0 && data.length !== this.battleBots.length) { this.images.loaded = false; }
      if (data.length > 0 && !this.images.loaded) {
        MarvelAPI('characters', {
          publicKey: secrets.publicKey,
          privateKey: secrets.privateKey,
          timeout: 4000,
          query: {
            limit: 100,
            offset: Math.floor(Math.random() * 200) + 1
          }
        }, (err, body) => {
          if (err) {
            this.battleBots = data;
            this.battleBots.map(bot => { bot.pic = "http://via.placeholder.com/350x200"; return bot })
            this.setState({ battleBots: this.battleBots, info: "Unable to load images. Will retry in 5 minutes" })
          }
          else {
            let index_selected = []
            this.battleBots = data;
            this.battleBots.forEach((bot, idx, arr) => {
              let image
              for (let i = 0; i < body.data.results.length; i++) {
                image = body.data.results[i].thumbnail.path.split('/')[10]
                if (image !== "image_not_available" && image !== "4c002e0305708" && !index_selected.includes(i)) {
                  index_selected.push(i);
                  bot.pic = body.data.results[i].thumbnail.path + "/landscape_incredible." + body.data.results[i].thumbnail.extension;
                  this.images.storage.push(bot.pic)
                  break;
                }
              }
            });
            this.images.loaded = true;
            this.battleBots = _.orderBy(this.battleBots, ["longed"], ["desc"])
            this.setState({ battleBots: this.battleBots })
          }
        })
      } else {
        this.images.storage.forEach((pic, idx) => { this.battleBots[idx].pic = pic })
        this.battleBots = _.orderBy(this.battleBots, ["longed"], ["desc"])
        this.setState({ battleBots: this.battleBots })
      }
    }
  }

  /**
   * Handles events after websocket
   * reconnects to server
   * @param {Object} event 
   */
  reconnect(event) { }

  /**
   * Handles event when connection is closed
   * to the server
   * @param {Object} event 
   */
  connectionClosed(event) { console.log("Connection closed: ", event) }

  /**
   * Error handler for websocket connection
   * @param {Object} error 
   */
  connectionError(error) { console.log("Something bad happened :(", error) }

  render() {
    if (this.state && this.state.battleBots) {
      var botBoxes = this.state.battleBots.map((val, idx, arr) => {
        return (<BotBox key={idx} bot={val} />)
      })
    }
    return (
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <main role="main" className="container">
          <div className="row">
            <div className="jumbotron">
              <h1>Let the battle begin!</h1>
              <p className="lead">This example is a quick exercise to illustrate how fixed to top navbar works. As you scroll, it will remain fixed to the top of your browser's viewport.</p>
            </div>
            {this.state.info ?
              <div className="alert alert-info" role="alert">
                <strong>Unable to load images!</strong> Will retry in aproximately 5 minutes.
             </div> : null
            }
          </div>
        </main>
        <div className="container">
          <div className="row">
            {botBoxes ? botBoxes : <h1> We gotta turn those mofos on... </h1>}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
