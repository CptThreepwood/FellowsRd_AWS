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
      message: 'Email account to register or reset',
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
    const registerSuccess = (result) => {
      this.props.finalise({reset: true});
    }

    const registerFailure = (err) => {
      console.log(err);
      this.setState({message: err.message});
    }

    if (this.props.email) {
      register(this.props.email, registerSuccess, registerFailure)
    }
  };

  handleCancel = () => {
    this.props.finalise();
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <Dialog
          TransitionComponent={Transition}
          open={this.props.open}
          onClose={this.handleCancel}
          onBackdropClick={this.handleCancel}
          aria-labelledby="confirmation-dialog-title"
        >
          <DialogTitle id="confirmation-dialog-title">Register</DialogTitle>
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
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button color="primary" keyboardFocused={true} onClick={this.handleClose}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}