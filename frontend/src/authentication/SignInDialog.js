import React from 'react';

import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DialogTitle, DialogActions, DialogContent, Typography } from '@material-ui/core';

import { AuthContext } from '../AuthContext';
import { signIn, forgotPassword } from './CognitoHelperFunctions'

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export default class SignInDialog extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      message: '',
    };
    this.password = React.createRef();
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
    if (this.props.email && this.state.password) {
      signIn(
        this.props.email, this.state.password,
      ).then(
        user => {
          this.props.updateAuth({
            attributes: user.attributes,
            ...user.signInUserSession,
          });
          this.props.finalise({});
        }
      ).catch(
        err => {
          console.log(err);
          this.setState({message: err.message});
        }
      );
    } else {
      this.setState({message: 'Invalid email or password'});
    }
  };

  launchReset = () => {
    this.setState({password: ''});
    if (this.props.email) {
      forgotPassword(this.props.email).then(
        this.props.finalise({reset: true})
      ).catch(console.log)
    }
  }

  handleCancel = () => {
    this.setState({password: ''});
    this.props.finalise({});
  }

  launchRegister = () => {
    this.setState({password: ''});
    this.props.finalise({register: true});
  }

  render() {
    return (
        <Dialog
          TransitionComponent={Transition}
          open={this.props.open}
          onClose={this.handleCancel}
          onBackdropClick={this.handleCancel}
          aria-labelledby="confirmation-dialog-title"
        >
          <DialogTitle id="confirmation-dialog-title">Sign In</DialogTitle>
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
            <Button color="danger" keyboardFocused={true} onClick={this.launchReset}>
              Reset Password
            </Button>
          </DialogContent>
          <DialogActions>
            <Button color="primary"  onClick={this.launchRegister}>
              Register
            </Button>
            <Button color="primary"  onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button color="primary" keyboardFocused={true} onClick={this.handleClose}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}