import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { config } from './config'

let userPool = new CognitoUserPool({
  UserPoolId: config.cognito.userPoolId,
  ClientId: config.cognito.userPoolClientId
});

let createCognitoUser = (email) => new CognitoUser({
  Username: toUsername(email),
  Pool: userPool
});

let toUsername = (email) => email.replace('@', '-at-')

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

export {
  signIn
}