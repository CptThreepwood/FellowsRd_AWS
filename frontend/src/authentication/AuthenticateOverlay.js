import React from 'react';
import SignInDialog from './SignInDialog';
import RegisterDialog from './RegisterDialog';


export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      renderAuth: true
    }
  }

  render() {
    return (
      <div class='authenticationOverlay'>
        <SignInDialog updateAuth={this.props.updateAuth} />
        <RegisterDialog updateAuth={this.props.updateAuth} />
      </div>
    );
  }
}