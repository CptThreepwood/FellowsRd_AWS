import BookingCalendar from './calendar/Calendar.js'
import SplashSlides from './slideShow/SplashSlides.js'
import AuthenticateOverlay from './authentication/AuthenticateOverlay.js'
import React, { Component } from 'react';
import './App.css';

import Amplify from 'aws-amplify';
import config from './authentication/config.js';

Amplify.configure(config.Amplify);
Amplify.Logger.LOG_LEVEL = 'WARNING';

class App extends Component {
  constructor(props) {
    super(props);

    this.updateAuth = (authDetails) => {
      console.log(authDetails);
      this.setState({
        'authDetails': authDetails,
      });
    }

    this.state = {
      authDetails: null,
      updateAuth: this.updateAuth,
    };
  }

  render() {
    if (this.state.authDetails) {
      return (
        <div className="App">
          <div className="calendarContainer">
            <BookingCalendar authDetails={this.state.authDetails}/>
          </div>
        </div>
      )
    } else {
      return (
        <div className="App">
          <div className="slideShowContainer">
            <AuthenticateOverlay updateAuth={this.state.updateAuth}/>
            <SplashSlides />
          </div>
        </div>
      )
    }
  }
}

export default App;
