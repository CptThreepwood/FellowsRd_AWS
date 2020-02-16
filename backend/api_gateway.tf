resource "aws_api_gateway_rest_api" "booking_gateway" {
  name        = "${var.app_name}_gateway"
  description = "API Gateway for ${var.app_name} bookings"
}

resource "aws_api_gateway_authorizer" "cognito_auth" {
  name = "${var.app_name}_cognitoAuth"
  rest_api_id = aws_api_gateway_rest_api.booking_gateway.id

  type = "COGNITO_USER_POOLS"
  provider_arns = [aws_cognito_user_pool.users.arn]
}

resource "aws_api_gateway_resource" "proxy_resource" {
  rest_api_id = aws_api_gateway_rest_api.booking_gateway.id
  parent_id   = aws_api_gateway_rest_api.booking_gateway.root_resource_id
  path_part   = "bookings"
}

resource "aws_api_gateway_method" "CORS" {
  rest_api_id   = aws_api_gateway_rest_api.booking_gateway.id
  resource_id   = aws_api_gateway_resource.proxy_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "CORS" {
  rest_api_id = aws_api_gateway_rest_api.booking_gateway.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = aws_api_gateway_method.CORS.http_method

  type                    = "MOCK"

  # Transforms the incoming XML request to JSON
  passthrough_behavior = "NEVER"
  request_templates = {
    "application/json" = <<EOF
{
   "statusCode" : 200
}
EOF
  }
}

resource "aws_api_gateway_integration_response" "CORS" {
  depends_on = [aws_api_gateway_integration.CORS]

  rest_api_id = aws_api_gateway_rest_api.booking_gateway.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = aws_api_gateway_method.CORS.http_method
  status_code = aws_api_gateway_method_response.CORS.status_code


  response_parameters = {
      "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
      "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST,PUT'",
      "method.response.header.Access-Control-Allow-Origin" = "'*'"
  }
}

resource "aws_api_gateway_method_response" "CORS" {
  rest_api_id = aws_api_gateway_rest_api.booking_gateway.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = aws_api_gateway_method.CORS.http_method
  status_code = 200

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

resource "aws_api_gateway_method" "get_bookings" {
  rest_api_id   = aws_api_gateway_rest_api.booking_gateway.id
  resource_id   = aws_api_gateway_resource.proxy_resource.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_auth.id

  request_parameters = {
    "method.request.querystring.month" = false
  }
}

data "aws_region" "current" {}

resource "aws_api_gateway_integration" "get_bookings" {
  rest_api_id = aws_api_gateway_rest_api.booking_gateway.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = aws_api_gateway_method.get_bookings.http_method

  integration_http_method = "GET"
  type                    = "AWS"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.name}:dynamodb:action/Query"
  credentials             = aws_iam_role.api_dynamo.arn

  request_templates = {
    "application/json" = <<-EOT
      {
        "TableName": aws_dynamodb_table.booking_table.name,
        "KeyConditionExpression": "month = :v1",
        "ExpressionAttributeValues": { ":v1": { "S": "$input.params('month')" } }
      }
    EOT
  }
}

resource "aws_api_gateway_integration_response" "get_bookings" {
  depends_on = [aws_api_gateway_integration.get_bookings]

  rest_api_id = aws_api_gateway_rest_api.booking_gateway.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = aws_api_gateway_method.get_bookings.http_method
  status_code = aws_api_gateway_method_response.get_bookings.status_code

  response_templates = {
    "application/json" = <<-EOT
    #set($inputRoot = $input.path('$'))
      {
        "bookings": [
            #foreach($elem in $inputRoot.Items) {
              "commentId": "$elem.commentId.S",
              "userName": "$elem.userName.S",
              "message": "$elem.message.S"
            }#if($foreach.hasNext),#end
          #end
        ]
      }
    EOT
  }
}

resource "aws_api_gateway_method_response" "get_bookings" {
  rest_api_id = aws_api_gateway_rest_api.booking_gateway.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = aws_api_gateway_method.get_bookings.http_method
  status_code = 200

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
}

resource "aws_api_gateway_method" "create_booking" {
  rest_api_id   = aws_api_gateway_rest_api.booking_gateway.id
  resource_id   = aws_api_gateway_resource.proxy_resource.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_auth.id
}

resource "aws_api_gateway_integration" "create_booking" {
  rest_api_id = aws_api_gateway_rest_api.booking_gateway.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = aws_api_gateway_method.create_booking.http_method

  type                    = "AWS"
  integration_http_method = "POST"
  uri                     = "arn:aws:apigateway:${data.aws_region.current.name}:dynamodb:action/PutItem"
  credentials             = aws_iam_role.api_dynamo.arn

  request_templates = {
    "application/json" = <<-EOT
      {
        "TableName": aws_dynamodb_table.booking_table.name,
        "KeyConditionExpression": "month = :v1",
        "ExpressionAttributeValues": { ":v1": { "S": "$input.params('month')" } }
      }
    EOT
  }
}

resource "aws_api_gateway_deployment" "production" {
  depends_on = [
    aws_api_gateway_integration.create_booking,
    aws_api_gateway_integration.get_bookings,
  ]

  rest_api_id = aws_api_gateway_rest_api.booking_gateway.id
  stage_name  = "production"
}