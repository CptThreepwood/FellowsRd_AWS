data "aws_region" "current" {}

resource "local_file" "auth_config" {
    filename = "${path.module}/src/authentication/config.js"
    sensitive_content = templatefile(
        "${path.module}/auth_config.tpl.js", {
            site_url = var.site_url,
            userPoolId = var.userPoolId,
            userPoolWebClientId = var.userPoolWebClientId,
            region = data.aws_region.current.name
        }
    )
}

resource "local_file" "calendar_config" {
    filename = "${path.module}/src/calendar/config.js"
    sensitive_content = templatefile(
        "${path.module}/calendar_config.tpl.js", {
            api_invoke_url = var.api_invoke_url
        }
    )
}
