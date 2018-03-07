import React from "react";
import {Link} from "react-router-dom";
import logo from '../logo.svg';
import constants from "./constants";
import './recipe.css';

export default class RecipeView extends React.Component {

    render() {
        return (
                  <div className="App">
                    <header className="App-header">
                      <img src={logo} className="App-logo" alt="logo" />
                      <h1 className="App-title">Nice Choice!</h1>
                    </header>
                    <p className="App-intro">
                      Start cookin'!
                    </p>
                    <button className="btn btn-primary"
                                onClick={() => {
                                    // this.setState({ chanName: "random" });
                                    this.props.history.push(constants.routes.start)
                                }}>YUM</button>
                  </div>
                );
              }
}