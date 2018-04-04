import uuid from 'uuid/v5';

function getBookings(username, bookingData, ddb) {
  let bookings = [];
  let date = new Date(bookingData.startDate);
  while (date < Date(bookingData.endDate)) {
    bookings.push(
      ddb.get({
        TableName: 'FellowsRdBookings',
        IndexName: 'StartDate-UserId-index',
        KeyConditionExpression: 'HashKey = :hkey',
        ExpressionAttributeValues: {':hkey': Number(date)}
      })
    );
    bookings.push(
      ddb.get({
        TableName: 'FellowsRdBookings',
        IndexName: 'EndDate-UserId-index',
        KeyConditionExpression: 'HashKey = :hkey',
        ExpressionAttributeValues: {':hkey': Number(date)}
      })
    );
    date = new Date(date.setDate(date.getDate() + 1));
  }

}

function recordBooking(bookingId, username, bookingData, ddb) {
    return ddb.put({
        TableName: 'FellowsRdBookings',
        Item: {
            BookingId: bookingId,
            UserId: username,
            BunkRoom: bookingData.bunkRoom,
            GAndM: bookingData.GAndM,
            Rufus: bookingData.rufus,
            BackRoom: bookingData.backRoom,
            StartDate: bookingData.startDate,
            EndDate: bookingData.endDate
        },
    }).promise();
}

export {
  checkBooking,
  recordBooking
}
