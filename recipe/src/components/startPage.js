import React from "react";
import {Link} from "react-router-dom";
import constants from "./constants";
import './start.css';

export default class StartView extends React.Component {

    render() {
        return (
                  <div className="App">
                    <header className="App-header">
                      <img src={logo} className="App-logo" alt="logo" />
                      <h1 className="App-title">Welcome to Recipe Decider!</h1>
                    </header>
                    <p className="App-intro">
                      To get started, edit <code>src/App.js</code> and save to reload.
                    </p>
                    <button className="btn btn-primary"
                                onClick={() => {
                                    this.setState({ chanName: "random" });
                                    this.props.history.push(constants.routes.quiz)
                                }}>START</button>
                  </div>
                );
              }
}