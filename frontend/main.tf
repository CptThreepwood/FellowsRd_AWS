
resource "aws_s3_bucket" "log_bucket" {
  bucket = "${var.site_url}-log-bucket"
  acl    = "log-delivery-write"
}

resource "aws_s3_bucket" "website" {
  bucket = var.site_url
  acl    = "public-read"
  policy = <<EOF
{
  "Version":"2012-10-17",
  "Statement":[{
    "Sid":"PublicReadGetObject",
    "Effect":"Allow",
    "Principal": "*",
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::${var.site_url}/*"]
  }]
}
  EOF

  logging {
    target_bucket = aws_s3_bucket.log_bucket.id
    target_prefix = "log/"
  }

  website {
    index_document = "index.html"
    error_document = "error.html"
  }
}
