provider aws {
  region = "ap-southeast-2"
  profile = "personal"
}

module "backend" {
    source = "./backend"

    app_name    = "${var.app_name}"
    app_version = "${var.backend_version}"
}

module "frontend" {
    source = "./frontend"

    site_url            = "${var.site_url}"
    userPoolId          = "${module.backend.cognito_pool_id}"
    userPoolWebClientId = "${module.backend.frontent_client_id}"
}