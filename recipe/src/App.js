// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }

// export default App;

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {HashRouter as Router, Switch, Redirect, Route} from "react-router-dom";
import constants from "./components/constants";
import StartView from "./components/startPage";
import QuizView from "./components/quizPage";
import ResultsView from "./components/resultsPage";
import RecipeView from "./components/recipePage";

class App extends Component {
  render() {
    return (
      <Router>
          <Switch>
              <Route exact path = {constants.routes.start} component={StartView}/>
              <Route path = {constants.routes.quiz} component={QuizView}/>
              <Route path = {constants.routes.results} component={ResultsView}/>
              <Route path = {constants.routes.recipe} component={RecipeView}/>
              {/* if anyone tampers with URL, go to default */}
              <Redirect to = {constants.routes.start}/>
          </Switch>
      </Router>
  );
}
}

export default App;