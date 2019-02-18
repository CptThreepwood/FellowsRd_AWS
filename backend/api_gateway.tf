resource "aws_api_gateway_rest_api" "booking_gateway" {
  name        = "${var.app_name}_gateway"
  description = "API Gateway for ${var.app_name} bookings"
}

resource "aws_api_gateway_resource" "proxy_resource" {
  rest_api_id = "${aws_api_gateway_rest_api.booking_gateway.id}"
  parent_id   = "${aws_api_gateway_rest_api.booking_gateway.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy_method" {
  rest_api_id   = "${aws_api_gateway_rest_api.booking_gateway.id}"
  resource_id   = "${aws_api_gateway_resource.proxy_resource.id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "booking" {
  rest_api_id = "${aws_api_gateway_rest_api.booking_gateway.id}"
  resource_id = "${aws_api_gateway_method.proxy_method.resource_id}"
  http_method = "${aws_api_gateway_method.proxy_method.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.createBooking.invoke_arn}"
}

resource "aws_api_gateway_deployment" "production" {
  depends_on = [
    "aws_api_gateway_integration.booking",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.booking_gateway.id}"
  stage_name  = "production"
}