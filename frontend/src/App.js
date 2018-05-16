import SignInDialog from './SignInDialog';
import BookingCalendar from './Calendar.js'
import SplashSlides from './SplashSlides.js'
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SignInDialog/>
        <div class="splashSlides">
          <SplashSlides/>
        </div>
        {/* <div class="calendarContainer">
          <BookingCalendar />
        </div> */}
      </div>
    );
  }
}

export default App;
