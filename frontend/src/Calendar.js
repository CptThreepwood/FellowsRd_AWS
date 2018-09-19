import moment from 'moment';
import React, { Component } from 'react';
import ReactLoading from "react-loading";
import {Calendar, CalendarControls} from 'react-yearly-calendar';
import "./calendarStyle.css";


class BookingCalendar extends Component {
  getBookings() {
    // Get URL from config TODO
    return fetch('https://iuhpb83475.execute-api.ap-southeast-2.amazonaws.com/dev' + '/booking/get', {
      method: 'POST',
      credentials: 'omit',
      headers: {
          Authorization: this.props.authDetails.idToken.jwtToken,
        },
      body: JSON.stringify({
        startDate: "2018-01-01",
        endDate: "2019-01-01"
      }),
      contentType: 'application/json',
      mode: 'cors',
    }).then(response => response.json());
  }

  constructor(props) {
    super(props);

    const today = moment();

    this.state = {
      isLoading: true,
      year: today.year(),
      selectedDay: today,
      selectedRange: [today, moment(today).add(15, 'day')],
      showDaysOfWeek: true,
      showTodayBtn: true,
      showWeekSeparators: true,
      selectRange: true,
      firstDayOfWeek: 1, // monday
    };
  
    this.state.data = this.getBookings();
  }

  componentDidMount() {
    this.getBookings().then(data =>
      this.setState({
        customCSSclasses: day => (data.map(
            booking => day.isSameOrAfter( moment(booking[0].StartDate) ) && day.isBefore( moment(booking[0].EndDate) )
          ).some(x => x === true)) ? 'booked' : 'free',
        isLoading: false
      }, () => console.log(this.state))
    );
  }

  onPrevYear() {
    this.setState(prevState => ({
      year: prevState.year - 1
    }));
  }

  onNextYear() {
    this.setState(prevState => ({
      year: prevState.year + 1
    }));
  }

  goToToday() {
    const today = moment();

    this.setState({
      selectedDay: today,
      selectedRange: [today, moment(today).add(1, 'day')],
      year: today.year()
    });
  }

  datePicked(date) {
    this.setState({
      selectedDay: date,
      selectedRange: [date, moment(date).add(1, 'day')]
    });
  }

  rangePicked(start, end) {
    this.setState({
      selectedRange: [start, end],
      selectedDay: start
    });
  }

  onDatePicked(date) {
    alert(date);
  }

  render() {
    const {
      year,
      showTodayBtn,
      selectedDay,
      showDaysOfWeek,
      forceFullWeeks,
      showWeekSeparators,
      firstDayOfWeek,
      selectRange,
      selectedRange,
      customCSSclasses
    } = this.state;
    console.log(this.state);
    if (this.state.isLoading) {
      return (
        <div>
          <ReactLoading type='bubbles' color="#555" />
        </div>
      )
    } else {
      return (
        <div>
          <div id="calendar">
            <CalendarControls
              year={year}
              showTodayButton={showTodayBtn}
              onPrevYear={() => this.onPrevYear()}
              onNextYear={() => this.onNextYear()}
              goToToday={() => this.goToToday()}
            />
            <Calendar
              year={year}
              selectedDay={selectedDay}
              showDaysOfWeek={showDaysOfWeek}
              forceFullWeeks={forceFullWeeks}
              showWeekSeparators={showWeekSeparators}
              firstDayOfWeek={firstDayOfWeek}
              selectRange={selectRange}
              selectedRange={selectedRange}
              onPickDate={(date, classes) => this.datePicked(date, classes)}
              onPickRange={(start, end) => this.rangePicked(start, end)}
              customClasses={customCSSclasses}
            />
          </div>
        </div>
      )
    }
  }
}

export default BookingCalendar;