output "website_bucket" {
    value = "${aws_s3_bucket.website.bucket}"
}

output "log_bucket" {
    value = "${aws_s3_bucket.log_bucket.bucket}"
}