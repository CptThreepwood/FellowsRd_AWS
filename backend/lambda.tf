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

resource "aws_lambda_permission" "apiCreateRole" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.createBooking.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.booking_gateway.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apiGetRole" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.getBookings.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.booking_gateway.execution_arn}/*/*"
}

resource aws_lambda_function createBooking {
    name    = "${var.app_name}_createBooking"
    handler = "handler.createBooking"
    runtime = "nodejs8.10"

    role = "${aws_iam_role.lambda_role.arn}"
}

resource aws_lambda_function getBookings {
    name    = "${var.app_name}_getBookings"
    handler = "handler.getBookings"
    runtime = "nodejs8.10"

    role = "${aws_iam_role.lambda_role.arn}"
}