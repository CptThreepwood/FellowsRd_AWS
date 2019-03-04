'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const databaseOps = require('src/databaseOps');

const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.createBooking = (event, context, callback) => {
  if (!event.requestContext.authorizer) {
    errorResponse('Authorization not configured', context.awsRequestId, callback);
    return;
  }
  
  // Because we're using a Cognito User Pools authorizer, all of the claims
  // included in the authentication token are provided in the request context.
  // This includes the username as well as other attributes.
  const bookingId = uuid();
  console.log('Received event: ', event);
  console.log('Booking ID: ', bookingId);
  
  const requestBody = JSON.parse(event.body);
  const username = event.requestContext.authorizer.claims['cognito:username'];
  
  databaseOps.recordBooking(bookingId, username, requestBody, ddb).then(
    () => {
      callback(null, {
        "statusCode": 201,
        "body": JSON.stringify({
          BookingId: bookingId,
          Confirmed: true,
        }),
        "headers": {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
          'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        "isBase64Encoded": false
      });
    }
  ).catch(
    (err) => {
      console.error(err);
      errorResponse(err.message, context.awsRequestId, callback)
    }
  );
};
    
module.exports.getBookings = (event, context, callback) => {
  if (!event.requestContext.authorizer) {
    errorResponse('Authorization not configured', context.awsRequestId, callback);
    return;
  }

  console.log('Received event: ', event);
  const requestBody = JSON.parse(event.body);

  databaseOps.retrieveBookings(requestBody, ddb).then(
    (data) => {
      const responseBody = data.filter(
        item => item.Count > 0
      ).map(
        item => item.Items
      )
      callback(null, {
        "statusCode": 200,
        "body": JSON.stringify(responseBody),
        "headers": {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
          'Access-Control-Allow-Methods': 'POST'
        },
        "isBase64Encoded": false
      });
    }
  ).catch(
    (err) => {
      console.error(err);
      errorResponse(err.message, context.awsRequestId, callback)
    }
  );
};

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    "statusCode": 500,
    "body": JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    "headers": {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
      'Access-Control-Allow-Methods': 'POST'
    },
    "isBase64Encoded": false
  });
}
