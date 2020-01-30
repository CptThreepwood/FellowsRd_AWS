output "base_url" {
  value = aws_api_gateway_deployment.production.invoke_url
}

output "cognito_pool_endpoint" {
  value = aws_cognito_user_pool.users.endpoint
}

output "cognito_pool_id" {
  value = aws_cognito_user_pool.users.id
}

output "frontent_client_id" {
  value = aws_cognito_user_pool_client.frontendClient.id
}