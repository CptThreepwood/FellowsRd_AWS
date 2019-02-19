resource aws_iam_role lambda_role {
  name = "${var.app_name}_lambdaRole"

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

resource "aws_s3_bucket" "bookingLambdaBucket" {
    bucket      = "${lower(var.app_name)}-deployment-bucket"
    acl         = "private"
}

resource "aws_s3_bucket_object" "bookingLambdaPackage" {
    key         = "${var.app_name}_${var.version}.zip"
    bucket      = "${aws_s3_bucket.bookingLambdaBucket.id}"
    source      = "build/currentBuild.zip"
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
    role = "${aws_iam_role.lambda_role.arn}"
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
    role = "${aws_iam_role.lambda_role.arn}"
}