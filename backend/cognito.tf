resource "aws_cognito_user_pool" "users" {
  name = "${var.app_name}_users"
  username_attributes = ["email"]
  
  password_policy = {
    minimum_length    = 8
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
    require_uppercase = false
  }

  schema = {
    name = "displayName"
    attribute_data_type = "String"

    developer_only_attribute    = false
    mutable                     = true
    required                    = true
  }

  email_verification_subject = "Welcome to Fellows Rd"
}