data "aws_region" "current" {}

resource "local_file" "auth_config" {
    filename = "${path.module}/src/authentication/config.js"
    sensitive_content = templatefile(
        "${path.module}/auth_config.tmpl", {
            site_url = var.site_url,
            userPoolId = var.userPoolId,
            userPoolWebClientId = var.userPoolWebClientId,
            region = data.aws_region.current.name
        }
    )
}

data "external" "build" {
    program = ["sh", "build.sh", "${aws_s3_bucket.website.bucket}"]
    working_dir = "${path.module}"

    depends_on = [local_file.auth_config]
} 