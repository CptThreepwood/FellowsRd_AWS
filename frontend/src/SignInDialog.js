import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {signIn} from './CognitoHelperFunctions'
import { DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';

const floating_style = {
  width: '110px',
  marginLeft: '-55px',
  zIndex: 1,
  position: 'fixed',
  marginTop: '70vh',
};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export default class SignInDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      email: '',
      password: '',
    };
    this.email = React.createRef();
    this.password = React.createRef();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    let signinSuccess = (result) => {
      this.props.updateAuth(result);
      this.setState({open: false});
    }
    let signinFailure = (err) => {
      console.log(err);
      alert(err.message);
    }
    if (this.state.email && this.state.password) {
      signIn(
        this.state.email, this.state.password,
        signinSuccess, signinFailure
      )
    }
  };

  handleCancel = () => {
    this.setState({
      open: false,
      password: ''
    });
  }

  render() {

    return (
      <div>
      <MuiThemeProvider>
        <Button
          variant="contained"
          color="primary"
          icon={<AccountCircle/>}
          style={floating_style}
          onClick={this.handleOpen}
        >Sign In</Button>
        <Dialog
          TransitionComponent={Transition}
          open={this.state.open}
          onClose={this.handleCancel}
          onBackdropClick={this.handleCancel}
        >
          <DialogTitle>Sign In</DialogTitle>
          <DialogContent>
            <TextField
              label="Email"
              autoFocus
              value={this.state.email}
              onChange={this.handleChange('email')}
              margin="dense"
              fullWidth
            />
            <TextField
              type='password'
              label="Password"
              value={this.state.password}
              onChange={this.handleChange('password')}
              margin="dense"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary"  onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button color="primary" keyboardFocused={true} onClick={this.handleClose}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
      </div>
    );
  }
}