import React from "react";
import {Link} from "react-router-dom";
import logo from '../logo.svg';
import constants from "./constants";
import './quiz.css';

export default class QuizView extends React.Component {

    render() {
        return (
                  <div className="App">
                    <header className="App-header">
                      <img src={logo} className="App-logo" alt="logo" />
                      <h1 className="App-title">Start by taking this quiz:</h1>
                    </header>
                    <p className="App-intro">
                      Select the ingredients you have, and any dietary restrictions.
                    </p>
                    <button className="btn btn-primary"
                                onClick={() => {
                                    // this.setState({ chanName: "random" });
                                    this.props.history.push(constants.routes.results)
                                }}>START</button>
                  </div>
                );
              }
}