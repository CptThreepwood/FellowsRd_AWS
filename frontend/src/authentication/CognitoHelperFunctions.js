import { CognitoUserPool, AuthenticationDetails, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { config } from './config'

let userPool = new CognitoUserPool({
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.userPoolClientId
});

let createCognitoUser = (email) => new CognitoUser({
  Username: toUsername(email),
  Pool: userPool
});

const toUsername = (email) => email.replace('@', '-at-')

function signIn(email, password, onSuccess, onFailure) {
  const authenticationDetails = new AuthenticationDetails({
    Username: toUsername(email),
    Password: password
  });

  let cognitoUser = createCognitoUser(email);
  cognitoUser.authenticateUser(
    authenticationDetails, {
      onSuccess: onSuccess,
      onFailure: onFailure
    }
  );
}

function register(email, displayName, password, onSuccess, onFailure) {
  const attributeList = [
    new CognitoUserAttribute({Name: 'email', Value: email}),
    new CognitoUserAttribute({Name: 'displayName', Value: displayName})
  ];

  userPool.signUp(
    email, password, attributeList, null,
    (err, result) => err ? onFailure(err) : onSuccess(result)
  );
}

function forgotPassword(email, onSuccess, onFailure) {
  let cognitoUser = createCognitoUser(email);
  cognitoUser.forgotPassword({
    onSuccess: onSuccess,
    onFailure: onFailure,
  });
}

function verifyNewPassword(email, password, verificationCode, onSuccess, onFailure) {
  let cognitoUser = createCognitoUser(email);
  cognitoUser.confirmPassword(
    verificationCode, password,
    onSuccess, onFailure,
  );
}

export {
  signIn, register, forgotPassword, verifyNewPassword
}