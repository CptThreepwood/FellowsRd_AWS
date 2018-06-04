import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import {signIn} from './CognitoHelperFunctions'

const floating_style = {
  width: '110px',
  marginLeft: '-55px',
  zIndex: 1,
  position: 'fixed',
  marginTop: '70vh',
};

const customContentStyle = {
  width: '25%',
  maxWidth: '25%',
};

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
    this.state.password = '';
    this.setState({open: false});
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleCancel}
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
          title="Sign In"
          actions={actions}
          modal={false}
          contentStyle={customContentStyle}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            hintText="Email"
            value={this.state.email}
            onChange={this.handleChange('email')}
          /><br />
          <TextField
            type='password'
            hintText="Password"
            value={this.state.password}
            onChange={this.handleChange('password')}
          /><br />
        </Dialog>
      </MuiThemeProvider>
      </div>
    );
  }
}