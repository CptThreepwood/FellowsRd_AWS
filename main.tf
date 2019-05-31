provider aws {
  region = "ap-southeast-2"
  profile = "personal"
}

module "backend" {
    source = "./backend"

    app_name    = "${var.app_name}"
    version     = "${var.backend_version}"
}

module "frontend" {
    source = "./frontend"

    site_url     = "${var.site_url}"
    version      = "${var.frontend_version}"
    main_js      = "${var.main_js_filepath}"
    main_js_map  = "${var.main_js_map_filepath}"
    main_css     = "${var.main_css_filepath}"
    main_css_map = "${var.main_css_map_filepath}"
}