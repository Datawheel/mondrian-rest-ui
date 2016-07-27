import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';

import { clickButton } from './redux'
import ClickerButton from './components/ClickerButton';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
            <ClickerButton onClick={() => this.props.dispatch(clickButton())}>This is the button's {this.props.clickCounter}</ClickerButton>
        </p>
      </div>
    );
  }
}

const ConnectedApp = connect((state) => (
    {
        clickCounter: state.timesClicked
    }
))(App);

export default ConnectedApp;
