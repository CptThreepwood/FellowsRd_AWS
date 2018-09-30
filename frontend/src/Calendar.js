import moment from 'moment';
import React, { Component } from 'react';
import ReactLoading from "react-loading";
import {Calendar, CalendarControls} from 'react-yearly-calendar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Backup from '@material-ui/icons/Backup';
import "./calendarStyle.css";
import { areRangesOverlapping } from 'date-fns';


class BookingCalendar extends Component {
  getBookings(year) {
    // Get URL from config TODO
    var start = new Date(year, 0, 1);
    var end = new Date(year + 1, 0, 1);
    return fetch('https://iuhpb83475.execute-api.ap-southeast-2.amazonaws.com/dev' + '/booking/get', {
      method: 'POST',
      credentials: 'omit',
      headers: {
          Authorization: this.props.authDetails.idToken.jwtToken,
        },
      body: JSON.stringify({
        startDate: start.toDateString(),
        endDate: end.toDateString(),
      }),
      contentType: 'application/json',
      mode: 'cors',
    }).then(
      response => response.json()
    ).then(
      // Why only take the first response?  This is maybe a bug for the future
      bookings => bookings.map(this.formatBooking)
    );
  }

  formatBooking(booking) {
    return {
      ...booking[0],
      StartDate: new moment(booking[0].StartDate),
      EndDate: new moment(booking[0].EndDate),
    }
  }

  constructor(props) {
    super(props);

    const today = moment();

    this.state = {
      isLoading: true,
      year: today.year(),
      selectedDay: today,
      selectedRange: [today, moment(today).add(1, 'day')],
      showDaysOfWeek: true,
      showTodayBtn: true,
      showWeekSeparators: true,
      selectRange: true,
      firstDayOfWeek: 1, // monday
      bookings: []
    };
  }

  dayIsBooked(bookings) {
    return day => bookings.map(
      booking => (
        day.isBetween(
          moment(booking.StartDate).hours(0).minutes(0).seconds(0),
          moment(booking.EndDate).hours(0).minutes(0).seconds(0),
          null, "[)"
        )
      )
    ).some(x => x === true) ? 'booked' : 'free';
  }

  componentDidMount() {
    this.renderBookings();
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

  renderBookings() {
    return this.getBookings(this.state.year).then(data =>
      this.setState({
        bookings: data,
        customCSSclasses: this.dayIsBooked(data),
        isLoading: false
      })
    );
  }

  makeBooking(bookingData) {
    // Get URL from config TODO
    return fetch('https://iuhpb83475.execute-api.ap-southeast-2.amazonaws.com/dev' + '/booking/create', {
      method: 'POST',
      credentials: 'omit',
      headers: {
          Authorization: this.props.authDetails.idToken.jwtToken,
        },
      body: JSON.stringify(bookingData),
      contentType: 'application/json',
      mode: 'cors',
    }).then(this.renderBookings);
  }

  startBooking(bookingData) {
    this.setState({
      isLoading: true
    }, this.makeBooking(bookingData))
  }

  render() {
    console.log(this.state);

    const selectedBookings = this.state.bookings.filter(booking => areRangesOverlapping(
      booking.StartDate, booking.EndDate,
      this.state.selectedRange[0].toDate(), this.state.selectedRange[1].toDate()
    ));
    console.log(selectedBookings);

    const paperStyle = {
      margin: 20
    };

    if (this.state.isLoading) {
      return (
        <div>
          <ReactLoading type='bubbles' color="#555" />
        </div>
      )
    } else {
      return (
        <div>
          <MuiThemeProvider>
            <Paper style={paperStyle}>
              <div id="calendar">
                <CalendarControls
                  year={this.state.year}
                  showTodayButton={true}
                  onPrevYear={() => this.onPrevYear()}
                  onNextYear={() => this.onNextYear()}
                  goToToday={() => this.goToToday()}
                />
                <Calendar
                  year={this.state.year}
                  selectedDay={this.state.selectedDay}
                  showDaysOfWeek={true}
                  forceFullWeeks={true}
                  showWeekSeparators={true}
                  firstDayOfWeek={true}
                  selectRange={true}
                  selectedRange={this.state.selectedRange}
                  onPickDate={(date, classes) => this.datePicked(date, classes)}
                  onPickRange={(start, end) => this.rangePicked(start, end)}
                  customClasses={this.state.customCSSclasses}
                />
              </div>
            </Paper>
            <Paper style={paperStyle}>
              <div id="info">
                {selectedBookings.map((booking) => (
                <Card>
                  <CardHeader
                    title={booking.UserId}
                    subtitle={'Arriving ' + booking.StartDate.format('ddd, MMM Do Y') + ' Leaving ' + booking.EndDate.format('ddd, MMM Do Y')}
                  />
                </Card>
                ))}
                <Card>
                  <CardHeader
                    title={''}
                    subtitle={'Arriving: ' + this.state.selectedRange[0].format('ddd, MMM Do Y') + '<br> Leaving: ' + this.state.selectedRange[1].format('ddd, MMM Do Y')}
                    action={
                      <Button
                        variant="contained"
                        label="Book"
                        icon={<Backup />}
                        secondary={true}
                        style={paperStyle}
                        // onClick={
                        //   this.makeBooking({
                        //     StartDate: this.state.selectedRange[0],
                        //     EndDate: this.state.selectedRange[1],
                        //     nPeople: this.state.nPeople
                        //   })
                        // }
                      />
                    }
                  />
                  <TextField
                    type="number"
                    label="Number of People"
                    value={1}
                    onChange={event => this.setState({
                      nPeople: event.target.value()
                    })}
                    />
                </Card>
              </div>
            </Paper>
          </MuiThemeProvider>
        </div>
      )
    }
  }
}

export default BookingCalendar;