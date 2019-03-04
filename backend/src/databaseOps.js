function retrieveBookings(bookingData, ddb) {
  let dates = [];
  let date = new Date(bookingData.startDate);
  const endDate = new Date(bookingData.endDate);
  while (date <= endDate) {
    dates.push(new Date(date));
    date = new Date(date.setDate(date.getDate() + 1));
  }

  return Promise.all(dates.map(
    d => ddb.query({
      TableName: 'FellowsRdBookings',
      IndexName: 'StartDate-UserId-index',
      KeyConditionExpression: 'StartDate = :date',
      ExpressionAttributeValues: {':date': Number(d)}
    }).promise().then((data) => {
      return data;
    })
  ))
}
  
function recordBooking(bookingId, username, bookingData, ddb) {
  return ddb.put({
    TableName: 'FellowsRdBookings',
    Item: {
      bookingId: bookingId,
      userId: username,
      rooms: [...bookingData.rooms],
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      nPeople: bookingData.nPeople
    },
  }).promise();
}

module.exports = {
  retrieveBookings,
  recordBooking
}
