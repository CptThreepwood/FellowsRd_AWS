resource aws_dynamodb_table booking_table {
    name            = "${var.app_name}_bookings"
    billing_mode    = "PAY_PER_REQUEST"

    hash_key        = "bookingID"
    range_key       = "startDate"

    attribute = {
        name = "bookingID"
        type = "S"
    }
    attribute = {
        name = "userID"
        type = "S"
    }
    attribute = {
        name = "startDate"
        type = "S"
    }
    attribute = {
        name = "endDate"
        type = "S"
    }
    attribute = {
        name = "nPeople"
        type = "N"
    }
}