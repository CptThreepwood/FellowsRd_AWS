import BookingCalendar from './calendar/Calendar.js'
import SplashSlides from './slideShow/SplashSlides.js'
import AuthenticateOverlay from './authentication/AuthenticateOverlay.js'
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      authDetails: null,
    }

    this.updateAuth = this.updateAuth.bind(this);
  }

  updateAuth(authDetails) {
    console.log(authDetails);
    this.setState({'authDetails': authDetails});
    this.setState({'isLoggedIn': true})
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <div className="App">
          <div class="calendarContainer">
            <BookingCalendar
              authDetails={this.state.authDetails} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="App">
          <div class="slideShowContainer">
            <AuthenticateOverlay updateAuth={this.updateAuth} />
            <SplashSlides />
          </div>
        </div>
      );
    }
  }
}

export default App;
