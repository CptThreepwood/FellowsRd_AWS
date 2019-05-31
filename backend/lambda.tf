resource aws_iam_role write_booking_role {
  name = "${var.app_name}_write_lambda_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource aws_iam_role read_booking_role {
  name = "${var.app_name}_read_lambda_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_logging" {
  name = "${var.app_name}_lambda_logging"
  path = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "dynamo_write" {
  name = "${var.app_name}_dynamo_write"
  path = "/"
  description = "IAM policy for writing to the booking table"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
      ],
      "Resource": "${aws_dynamodb_table.booking_table.arn}",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "dynamo_read" {
  name = "${var.app_name}_dynamo_read"
  path = "/"
  description = "IAM policy for reading from the booking table"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:DescribeTable",
        "dynamodb:Query"
      ],
      "Resource": "${aws_dynamodb_table.booking_table.arn}",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "dynamoWrite" {
  role = "${aws_iam_role.write_booking_role.name}"
  policy_arn = "${aws_iam_policy.lambda_logging.arn}"
}

resource "aws_iam_role_policy_attachment" "write_lambda_logs" {
  role = "${aws_iam_role.write_booking_role.name}"
  policy_arn = "${aws_iam_policy.dynamo_write.arn}"
}

resource "aws_iam_role_policy_attachment" "dynamoRead" {
  role = "${aws_iam_role.read_booking_role.name}"
  policy_arn = "${aws_iam_policy.lambda_logging.arn}"
}

resource "aws_iam_role_policy_attachment" "read_lambda_logs" {
  role = "${aws_iam_role.read_booking_role.name}"
  policy_arn = "${aws_iam_policy.dynamo_read.arn}"
}

resource "aws_s3_bucket" "bookingLambdaBucket" {
    bucket      = "${lower(var.app_name)}-deployment-bucket"
    acl         = "private"
}

resource "aws_s3_bucket_object" "bookingLambdaPackage" {
    key         = "${var.app_name}_${var.version}.zip"
    bucket      = "${aws_s3_bucket.bookingLambdaBucket.id}"
    source      = "${path.module}/build/currentBuild.zip"
    # source      = "${data.archive_file.bookLambdaArchive.output_path}"
}
resource "aws_lambda_permission" "apiCreateRole" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.createBooking.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.production.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apiGetRole" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.getBookings.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.production.execution_arn}/*/*"
}

resource aws_lambda_function createBooking {
    function_name = "${var.app_name}_createBooking"

    # Deployment information
    s3_bucket       = "${aws_s3_bucket_object.bookingLambdaPackage.bucket}"
    s3_key          = "${aws_s3_bucket_object.bookingLambdaPackage.key}"
    handler = "handler.createBooking"

    # Lambda Configuration
    timeout = 60
    runtime = "nodejs8.10"
    role = "${aws_iam_role.write_booking_role.arn}"
}

resource aws_lambda_function getBookings {
    function_name = "${var.app_name}_getBookings"

    # Deployment information
    s3_bucket       = "${aws_s3_bucket_object.bookingLambdaPackage.bucket}"
    s3_key          = "${aws_s3_bucket_object.bookingLambdaPackage.key}"
    handler = "handler.getBookings"

    # Lambda Configuration
    timeout = 60
    runtime = "nodejs8.10"
    role = "${aws_iam_role.read_booking_role.arn}"
}