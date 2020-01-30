resource "aws_cognito_user_pool" "users" {
  name = "${var.app_name}_users"
  username_attributes = ["email"]
  
  password_policy {
    minimum_length    = 8
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
    require_uppercase = false
  }

  email_verification_subject = "Welcome to Fellows Rd"
  auto_verified_attributes = ["email"]
}

resource aws_cognito_user_pool_client "frontendClient" {
  name = "frontendClient"

  user_pool_id = aws_cognito_user_pool.users.id
}