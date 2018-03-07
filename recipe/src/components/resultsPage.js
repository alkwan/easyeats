import React from "react";
import {Link} from "react-router-dom";
import logo from '../logo.svg';
import constants from "./constants";
import './results.css';

export default class ResultsView extends React.Component {

    render() {
        return (
                  <div className="App">
                    <header className="App-header">
                      <img src={logo} className="App-logo" alt="logo" />
                      <h1 className="App-title">Here are your options:</h1>
                    </header>
                    <p className="App-intro">
                      Generated for you:
                    </p>
                    <button className="btn btn-primary"
                                onClick={() => {
                                    // this.setState({ chanName: "random" });
                                    this.props.history.push(constants.routes.recipe)
                                }}>Select</button>
                  </div>
                );
              }
}