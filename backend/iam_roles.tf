## Create a role that API gateway can attach to
resource aws_iam_role api_dynamo {
  name = "${var.app_name}_write_lambda_role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

## Write to dynamo table

data "aws_iam_policy_document" dynamo_write {
    statement {
        sid = 1
        actions = [
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ]
        resources = [
            aws_dynamodb_table.booking_table.arn
        ]
    }
}

resource "aws_iam_policy" "dynamo_write" {
  name = "dynamo_write"
  path = "/${var.app_name}/"
  description = "IAM policy for writing to the booking table"
  policy = data.aws_iam_policy_document.dynamo_write.json
}

resource "aws_iam_role_policy_attachment" "dynamo_write" {
  role       = aws_iam_role.api_dynamo.name
  policy_arn = aws_iam_policy.dynamo_write.arn
}

## Read from dynamo table

data "aws_iam_policy_document" dynamo_read {
    statement {
        sid = 1
        actions = [
            "dynamodb:Query"
        ]
        resources = [
            aws_dynamodb_table.booking_table.arn
        ]
    }
}

resource "aws_iam_policy" "dynamo_read" {
  name = "dynamo_read"
  path = "/${var.app_name}/"
  description = "IAM policy for reading from the booking table"
  policy = data.aws_iam_policy_document.dynamo_read.json
}

resource "aws_iam_role_policy_attachment" "dynamo_read" {
  role       = aws_iam_role.api_dynamo.name
  policy_arn = aws_iam_policy.dynamo_read.arn
}
