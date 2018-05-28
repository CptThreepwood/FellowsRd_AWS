import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { config } from './config'

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

// function handleSignin(event) {
//   var email = $('#emailInputSignin').val();
//   var password = $('#passwordInputSignin').val();
//   event.preventDefault();
//   signin(email, password,
//       function signinSuccess() {
//           console.log('Successfully Logged In');
//           window.location.href = 'booking.html';
//       },
//       function signinError(err) {
//           alert(err);
//       }
//   );
// }


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

    this.userPool = new CognitoUserPool({
      UserPoolId: config.cognito.userPoolId,
      ClientId: config.cognito.userPoolClientId
    });
  }

  toUsername = (email) => email.replace('@', '-at-')

  createCognitoUser = (email) => new CognitoUser({
      Username: this.toUsername(email),
      Pool: this.userPool
  });

  signin = function(email, password, onSuccess, onFailure) {
    const authenticationDetails = new AuthenticationDetails({
      Username: this.toUsername(email),
      Password: password
    });

    let cognitoUser = this.createCognitoUser(email);
    cognitoUser.authenticateUser(
      authenticationDetails, {
        onSuccess: onSuccess,
        onFailure: onFailure
      }
    );
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
    if (this.state.email && this.state.password) {
      const username = this.toUsername(this.state.email);
    }
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