import BookingCalendar from './calendar/Calendar.js'
import SplashSlides from './slideShow/SplashSlides.js'
import SignInDialog from './authentication/SignInDialog';
import RegisterDialog from './authentication/RegisterDialog';
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
            <SignInDialog updateAuth={this.props.updateAuth} />
            <RegisterDialog updateAuth={this.props.updateAuth} />
            <SplashSlides updateAuth={this.updateAuth} />
          </div>
        </div>
      );
    }
  }
}

export default App;
