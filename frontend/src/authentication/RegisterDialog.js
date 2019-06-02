import React from 'react';

import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import { DialogTitle, DialogActions, DialogContent, Typography } from '@material-ui/core';

import { register, forgotPassword} from './CognitoHelperFunctions';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export default class RegisterDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: 'Please provide new account details',
      password: '',
      showReset: false,
    };
  }

  shouldComponentUpdate(nextProps) {
    if (!this.props.open && !nextProps.open) {
      return false;
    }
    return true;
  }

  handleChange = name => event => {
    if (name === 'email') {
      this.props.updateEmail(event.target.value)
    } else {
      this.setState({
        [name]: event.target.value,
      });
    }
  };

  handleClose = () => {
    const registerSuccess = (data) => {
      console.log(data);
      this.state.password = '';
      this.props.finalise({confirm: true});
    }

    const registerFailure = (err) => {
      console.log(err);
      this.state.password = '';
      if (err.code === "UsernameExistsException") {
        this.setState({
          message: 'This email address is already registered',
          showReset: true,
        })
        this.props.finalise({reset: true})
      } else {
        this.setState({message: err.message});
      }
    }

    if (this.props.email) {
      register(
        this.props.email, this.state.password,
        registerSuccess, registerFailure
      )
    }
  };

  handleCancel = () => {
    this.props.finalise();
  }

  render() {
    return (
      <div>
        <Dialog
          TransitionComponent={Transition}
          open={this.props.open}
          onClose={this.handleCancel}
          onBackdropClick={this.handleCancel}
          aria-labelledby="confirmation-dialog-title"
        >
          <DialogTitle id="confirmation-dialog-title">Sign Up</DialogTitle>
          <DialogContent>
            <Typography>{this.state.message}</Typography>
            <TextField
              label="Email"
              autoFocus
              value={this.props.email}
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
            <Button color="primary" onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button color="primary" keyboardFocused={true} onClick={this.handleClose}>
              Sign Up
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}