import BookingCalendar from './Calendar.js'
import SplashSlides from './SplashSlides.js'
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
              authDetails={this.authDetails} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="App">
            <SplashSlides
              updateAuth={this.updateAuth} />
        </div>
      );
    }
  }
}

export default App;
