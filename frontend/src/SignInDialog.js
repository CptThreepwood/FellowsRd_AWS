import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';


const floating_style = {
  margin: 12,
  zIndex: 1,
  position: 'fixed',
  marginTop: '70vh',
};

export default class SignInDialog extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];

    return (
      <div>
      <MuiThemeProvider>
        <RaisedButton
          label="Sign In"
          primary={true}
          icon={<AccountCircle/>}
          style={floating_style}
          onClick={this.handleOpen}
        />
        <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            hintText="Email"
          /><br />
          <TextField
            hintText="Password"
          /><br />
        </Dialog>
      </MuiThemeProvider>
      </div>
    );
  }
}