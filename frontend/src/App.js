import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import BookingCalendar from './Calendar.js'
import SplashSlides from './SplashSlides.js'
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const floating_style = {
  margin: 12,
  zIndex: 1,
  position: 'fixed',
  marginTop: '70vh',
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          <RaisedButton
            label="Sign In"
            primary={true}
            icon={<AccountCircle/>}
            style={floating_style}
          />
          <div class="splashSlides">
            <SplashSlides/>
          </div>
          {/* <div class="calendarContainer">
            <BookingCalendar />
          </div> */}
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
