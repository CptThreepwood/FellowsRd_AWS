import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {register} from './CognitoHelperFunctions'
import { DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

export default class RegisterDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.email,
    };
    this.email = React.createRef();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClose = () => {
    const registerSuccess = (result) => {
      this.props.finalise({email: this.state.email});
    }

    const registerFailure = (err) => {
      console.log(err);
      alert(err.message);
    }

    if (this.state.email) {
      register(this.state.email, registerSuccess, registerFailure)
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
          <DialogTitle id="confirmation-dialog-title">Register</DialogTitle>
          <DialogContent>
            <TextField
              label="Email"
              autoFocus
              value={this.state.email}
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