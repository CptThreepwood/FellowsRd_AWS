resource aws_dynamodb_table booking_table {
    name            = "${var.app_name}_bookings"
    billing_mode    = "PAY_PER_REQUEST"

    hash_key        = "userID"
    range_key       = "startDate"

    attribute {
        name = "userID"
        type = "S"
    }
    attribute {
        name = "startDate"
        type = "S"
    }
}