import React from 'react';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import SignInDialog from './SignInDialog';
import RegisterDialog from './RegisterDialog';
import ResetDialog from './ResetDialog';
import ConfirmDialog from './ConfirmDialog';

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
      signInOpen: false,
      registerOpen: false,
      resetOpen: false,
      currentEmail: '',
    }
  }

  shouldComponentUpdate(nextProps) {
    // if (
    //   this.props.signInOpen == nextProps.signInOpen &&
    //   this.props.registerOpen == nextProps.registerOpen &&
    //   this.props.resetOpen == nextProps.resetOpen
    // ) {
    //   return false;
    // }
    return true;
  }

  handleEmailChange = (email) => {
    this.setState({email});
  }

  handleDialog = (data = {}) => {
    const {signIn, register, reset, confirm} = data;
    this.setState({
      signInOpen: signIn || false,
      registerOpen: register || false,
      resetOpen: reset || false,
      confirmOpen: confirm || false,
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
            onClick={() => this.handleDialog({signIn: true})}
          >Sign In</Button>
          <SignInDialog
            open={this.state.signInOpen}
            email={this.state.email}
            updateEmail={this.handleEmailChange}
            finalise={this.handleDialog}
            updateAuth={this.props.updateAuth}
          />
          <RegisterDialog
            open={this.state.registerOpen}
            email={this.state.email}
            updateEmail={this.handleEmailChange}
            finalise={this.handleDialog}
          />
          <ResetDialog
            open={this.state.resetOpen}
            email={this.state.email}
            finalise={this.handleDialog}
          />
          <ConfirmDialog
            open={this.state.confirmOpen}
            email={this.state.email}
            finalise={this.handleDialog}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}