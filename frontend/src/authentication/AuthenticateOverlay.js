import React from 'react';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import SignInDialog from './SignInDialog';
import RegisterDialog from './RegisterDialog';
import ResetDialog from './ResetDialog';

const floating_style = {
  width: '110px',
  marginLeft: '-55px',
  zIndex: 1,
  position: 'fixed',
  marginTop: '70vh',
};

export default class AuthenticateOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renderAuth: true,
      signInOpen: false,
      registerOpen: false,
      registerEmail: '',
      resetOpen: false,
      resetEmail: '',
    }
  }

  openSignIn = () => {
    this.setState({
      signInOpen: true,
      registerOpen: false,
      resetOpen: false,
    })
  }

  closeSignIn = (data={}) => {
    if (Object.keys(data).length) {
      this.setState({
        signInOpen: false,
        registerOpen: true,
        resetOpen: false,
        registerEmail: data.email || ''
      })
    } else {
      this.setState({
        signInOpen: false,
        registerOpen: false,
        resetOpen: false,
      })
    }
  }

  closeRegister = (data={}) => {
    if (Object.keys(data).length) {
      this.setState({
        registerOpen: false,
        resetOpen: true,
        resetOpen: false,
        resetEmail: data.email || ''
      })
    } else {
      this.setState({
        signInOpen: false,
        registerOpen: false,
        resetOpen: false,
      })
    }
  }

  closeReset = () => {
    this.setState({
      signInOpen: false,
      registerOpen: false,
      resetOpen: false,
    })
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
            onClick={this.openSignIn}
          >Sign In</Button>
          <SignInDialog
            open={this.state.signInOpen}
            updateAuth={this.props.updateAuth}
            finalise={this.closeSignIn}
          />
          <RegisterDialog
            open={this.state.registerOpen}
            email={this.state.registerEmail}
            finalise={this.closeRegister}
          />
          <ResetDialog
            open={this.state.resetOpen}
            email={this.state.resetEmail}
            updateAuth={this.props.updateAuth}
            finalise={this.closeReset}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}