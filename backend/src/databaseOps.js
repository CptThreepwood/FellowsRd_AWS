import uuid from 'uuid/v5';

function retrieveBookings(bookingData, ddb) {
  let dates = [];
  let date = new Date(bookingData.startDate);
  const endDate = new Date(bookingData.endDate);
  while (date <= endDate) {
    dates.push(new Date(date));
    date = new Date(date.setDate(date.getDate() + 1));
  }

  return Promise.all(dates.map(
    d => ddb.get({
      TableName: 'FellowsRdBookings',
      IndexName: 'StartDate-UserId-index',
      KeyConditionExpression: 'HashKey = :hkey',
      ExpressionAttributeValues: {':hkey': Number(date)}
    }).promise().then((data) => {
      console.log(data);
      return data;
    })
  ))
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
  retrieveBookings,
  recordBooking
}
