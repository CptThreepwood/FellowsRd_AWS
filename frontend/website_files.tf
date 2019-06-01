resource aws_s3_bucket_object "index" {
    bucket  = "${aws_s3_bucket.website.bucket}"
    key     = "index.html"
    source  = "${path.module}/build/index.html"

    content_type = "text/html"
    depends_on = [aws_s3_bucket_object.main_js]
}

resource aws_s3_bucket_object "asset-manifest" {
    bucket  = "${aws_s3_bucket.website.bucket}"
    key     = "asset-manifest.json"
    source  = "${path.module}/build/asset-manifest.json"

    content_type = "application/json"
    depends_on = [aws_s3_bucket_object.main_js]
}

resource aws_s3_bucket_object "favicon" {
    bucket  = "${aws_s3_bucket.website.bucket}"
    key     = "favicon.ico"
    source  = "${path.module}/build/favicon.ico"

    content_type = "image/x-icon"
    depends_on = [aws_s3_bucket_object.main_js]
}

resource aws_s3_bucket_object "manifest" {
    bucket  = "${aws_s3_bucket.website.bucket}"
    key     = "manifest.json"
    source  = "${path.module}/build/manifest.json"

    content_type = "application/json"
    depends_on = [aws_s3_bucket_object.main_js]
}

resource aws_s3_bucket_object "service_worker_js" {
    bucket  = "${aws_s3_bucket.website.bucket}"
    key     = "service-worker.js"
    source  = "${path.module}/build/service-worker.js"

    content_type = "text/javascript"
    depends_on = [aws_s3_bucket_object.main_js]
}

resource aws_s3_bucket_object "main_js" {
    bucket  = "${aws_s3_bucket.website.bucket}"
    key     = "${data.external.build.result.main_js}"
    source  = "${path.module}/build/${data.external.build.result.main_js}"

    content_type = "text/javascript"
}

resource aws_s3_bucket_object "main_js_map" {
    bucket  = "${aws_s3_bucket.website.bucket}"
    key     = "${data.external.build.result.main_js_map}"
    source  = "${path.module}/build/${data.external.build.result.main_js_map}"

    content_type = "text/javascript"
}

resource aws_s3_bucket_object "main_css" {
    bucket  = "${aws_s3_bucket.website.bucket}"
    key     = "${data.external.build.result.main_css}"
    source  = "${path.module}/build/${data.external.build.result.main_css}"

    content_type = "text/css"
}

resource aws_s3_bucket_object "main_css_map" {
    bucket  = "${aws_s3_bucket.website.bucket}"
    key     = "${data.external.build.result.main_css_map}"
    source  = "${path.module}/build/${data.external.build.result.main_css_map}"

    content_type = "text/css"
}