import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import Calendar from 'react-calendar';

class MyApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
    };

    this.onChange = function(date){
      this.setState({ date })
    };
  };

  render() {
    return (
      <div>
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Calendar />,
  document.getElementById('calendar_root')
);