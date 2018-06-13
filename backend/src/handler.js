'use strict';

import {retrieveBookings, recordBooking} from './databaseOps';
import AWS from 'aws-sdk';

const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.createBooking = (event, context, callback) => {
  // if (!event.requestContext.authorizer) {
  //   errorResponse('Authorization not configured', context.awsRequestId, callback);
  //   return;
  // }

  // Because we're using a Cognito User Pools authorizer, all of the claims
  // included in the authentication token are provided in the request context.
  // This includes the username as well as other attributes.
  const username = event.requestContext.authorizer.claims['cognito:username'];

  console.log('Received event (', bookingId, '): ', event);
  const requestBody = JSON.parse(event.body);
  const bookingId = uuid('www.fellowsrd.com');

  recordBooking(bookingId, username, requestBody, ddb).then(() => {
      callback(null, {
          statusCode: 201,
          body: JSON.stringify({
            BookingId: bookingId,
            Confirmed: true,
          }),
          headers: {
              'Access-Control-Allow-Origin': '*',
          },
      });
  }).catch((err) => {
      console.error(err);
      errorResponse(err.message, context.awsRequestId, callback)
  });
};

module.exports.getBookings = (event, context, callback) => {
  // if (!event.requestContext.authorizer) {
  //   errorResponse('Authorization not configured', context.awsRequestId, callback);
  //   return;
  // }

  console.log('Received event: ', event);
  const requestBody = JSON.parse(event.body);

  retrieveBookings(requestBody, ddb).then((data) => {
      callback(null, {
          statusCode: 201,
          body: JSON.stringify({
            Confirmed: true,
          }),
          headers: {
              'Access-Control-Allow-Origin': '*',
          },
      });
  }).catch((err) => {
      console.error(err);
      errorResponse(err.message, context.awsRequestId, callback)
  });
};

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
