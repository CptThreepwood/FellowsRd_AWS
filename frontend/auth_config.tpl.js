const config = {
  Amplify: {
    Auth: {
      // REQUIRED - Amazon Cognito Region
      region: '${region}',
  
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: '${userPoolId}',
  
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '${userPoolWebClientId}',
  
      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false,
  
      // OPTIONAL - Configuration for cookie storage
      // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
      // cookieStorage: {
      //   // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      //   domain: '.${site_url}',
      //   // OPTIONAL - Cookie path
      //   path: '/',
      //   // OPTIONAL - Cookie expiration in days
      //   expires: 365,
      //   // OPTIONAL - Cookie secure flag
      //   // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      //   secure: false
      // },
  
      // OPTIONAL - customized storage object
      // storage: new MyStorage(),
      
      // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: 'USER_SRP_AUTH'
    },
    Analytics: {disabled: true}
  }
}

export default config;