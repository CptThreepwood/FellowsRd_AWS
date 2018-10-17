import moment from 'moment';
import React, { Component } from 'react';
import ReactLoading from "react-loading";
import {Calendar, CalendarControls} from 'react-yearly-calendar';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import BackupIcon from '@material-ui/icons/Backup';
import "./calendarStyle.css";
import { areRangesOverlapping } from 'date-fns';
import {
  Avatar, Button,
  Card, CardActions, CardContent, CardHeader,
  Paper, Grid, TextField, Typography
} from '@material-ui/core';


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
      bookings: [],
      nPeople: 1,
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
    return this.setState({isLoading: true}).then(
      fetch(
        'https://iuhpb83475.execute-api.ap-southeast-2.amazonaws.com/dev' + '/booking/create', {
        method: 'POST',
        credentials: 'omit',
        headers: {
            Authorization: this.props.authDetails.idToken.jwtToken,
          },
        body: JSON.stringify(bookingData),
        contentType: 'application/json',
        mode: 'cors',
        }
      )
    ).then(this.renderBookings);
  }

  startBooking(bookingData) {
    this.setState({
      isLoading: true
    }, this.makeBooking(bookingData))
  }

  render() {
    const selectedBookings = this.state.bookings.filter(booking => areRangesOverlapping(
      booking.StartDate, booking.EndDate,
      this.state.selectedRange[0].toDate(), this.state.selectedRange[1].toDate()
    ));

    const paperStyle = {
      margin: 20
    };
    const bookButtonStyle = {
      'margin-left': 'auto'
    }

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
            <div id="info">
              <Grid container spacing={24}>
                {selectedBookings.map((booking) => (
                  <Grid item xs={6}>
                    <Paper style={paperStyle}>
                      <Card>
                        <CardHeader
                          avatar={
                            <Avatar aria-label={booking.UserId} className='booking-avatar'>
                              {booking.UserId}
                            </Avatar>
                          }
                          title={booking.UserId}
                        />
                        <CardContent>
                          <Typography variant="h5">
                            {'Arriving: ' + booking.StartDate.format('ddd, MMM Do Y')}
                          </Typography>
                          <Typography variant="h5">
                            {'Leaving: ' + booking.EndDate.format('ddd, MMM Do Y')}
                          </Typography>
                          <Typography variant="h5">
                            {'Number of People: ' + booking.nPeople}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Paper>
                  </Grid>
                ))}
                {
                  selectedBookings.length % 2 !== 0 && 
                  <Grid item xs={6}>
                  </Grid>
                }
                <Grid item xs={6}>
                </Grid>
                <Grid item xs={6}>
                  <Paper style={paperStyle}>
                    <Card>
                      <CardContent>
                        <Typography variant="h5">
                        {
                          'Arriving: ' + this.state.selectedRange[0].format('ddd, MMM Do Y')
                        }
                        </Typography>
                        <Typography>
                        {
                          'Leaving: ' + this.state.selectedRange[1].format('ddd, MMM Do Y')
                        }
                        </Typography>
                      </CardContent>
                      <CardActions>
                      <TextField
                        type="number"
                        label="Number of People"
                        value={this.state.nPeople}
                        onChange={event => this.setState({
                          nPeople: event.target.value()
                        })}
                        />
                        <Button
                          variant="contained"
                          color="secondary"
                          style={bookButtonStyle}
                          onClick={
                            this.makeBooking({
                              StartDate: this.state.selectedRange[0],
                              EndDate: this.state.selectedRange[1],
                              nPeople: this.state.nPeople
                            })
                          }
                        >
                          Book
                          <BackupIcon />
                        </Button>
                      </CardActions>
                    </Card>
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </MuiThemeProvider>
        </div>
      )
    }
  }
}

export default BookingCalendar;