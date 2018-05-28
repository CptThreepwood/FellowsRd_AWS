import BookingCalendar from './Calendar.js'
import SplashSlides from './SplashSlides.js'
import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <SplashSlides/>
        {/* <div class="calendarContainer">
          <BookingCalendar />
        </div> */}
      </div>
    );
  }
}

export default App;
