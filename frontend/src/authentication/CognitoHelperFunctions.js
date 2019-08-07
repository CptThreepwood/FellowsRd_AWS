import {Auth} from 'aws-amplify';

const toUsername = (email) => email.replace('@', '-at-')

export const signIn = function(email, password) {
  return Auth.signIn(email, password)

  /*.then(
    user => {
      if (user.challengeName === 'SMS_MFA' ||
        user.challengeName === 'SOFTWARE_TOKEN_MFA') {
        // You need to get the code from the UI inputs
        // and then trigger the following function with a button click
        console.log(user.challengeName);
      } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        onFailure('ResetPassword');
      } else if (user.challengeName === 'MFA_SETUP') {
        // This happens when the MFA method is TOTP
        // The user needs to setup the TOTP before using it
        // More info please check the Enabling MFA part
        console.log(user.challengeName);
        Auth.setupTOTP(user);
      } else {
        // The user directly signs in
        onSuccess(user);
      }
    }
  ).catch(
    err => {
      if (err.code === 'UserNotConfirmedException') {
        onFailure('Reconfim');
      } else if (err.code === 'PasswordResetRequiredException') {
        onFailure('ResetPassword');
      } else if (err.code === 'NotAuthorizedException') {
        onFailure('IncorrectPassword');
      } else if (err.code === 'UserNotFoundException') {
        onFailure('UserNotFound');
      } else {
        onFailure(err);
      }
    }
  )*/
}

export const register = function(email, password) {
  return Auth.signUp({
    username: email,
    password,
    attributes: {
        email,
        preferred_username: email.split('@')[0],
    },
  });
}

export const forgotPassword = function(email) {
  return Auth.forgotPassword(email)
}

export const submitNewPassword = function(email, password, verificationCode, onSuccess, onFailure) {
  Auth.forgotPasswordSubmit(email, verificationCode, password)
    .then(onSuccess)
    .catch(onFailure);
}

export const launchVerifyEmail = function () {
  return Auth.verifyCurrentUserAttribute('email');
  
}
export const confimSignUp = function(email, verificationCode) {
  return Auth.confirmSignUp(email, verificationCode, {
    // Optional. Force user confirmation irrespective of existing alias. By default set to True.
    forceAliasCreation: true
  });
}
