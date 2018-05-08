import React, { Component } from 'react';
import Header from './components/Header';
import BotBox from './components/BotBox';
import Sockette from 'sockette';
import MarvelAPI from 'marvel-comics-api';
import secrets from './config/marvel-api';
import './App.css';
import { setInterval } from 'timers';

class App extends Component {

  constructor(props) {
    super(props);
    // Initializing websocket connection
    this.ws = new Sockette('ws://localhost:8995', {
      onopen: e => this.connectionOpened(e),
      onmessage: e => this.messageRecieved(e),
      onclose: e => this.connectionClosed(e),
      onerror: e => this.connectionError(e),
      onreconnect: e => this.reconnect(e)
    })
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
      this.battleBots = JSON.parse(event.data);
      MarvelAPI('characters', {
        publicKey: secrets.publicKey,
        privateKey: secrets.privateKey,
        timeout: 4000,
        query: {
          limit: this.battleBots.length,
          offset: Math.floor(Math.random() * 100) + 1
        }
      }, (err, body) => {
        if (err) console.log(err);
        this.battleBots.forEach((bot, idx, arr) => {
          bot.pic = body.data.results[idx].thumbnail.path + "/landscape_incredible." + body.data.results[idx].thumbnail.extension;
        });
        this.setState({ battleBots: this.battleBots })
      })
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
          </div>
        </main>
        <div className="container">
          <div className="row">
            {botBoxes}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
