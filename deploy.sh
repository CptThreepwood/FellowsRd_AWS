#!/bin/bash
PWD=`pwd`

terraform init
terraform apply

WEBSITE_BUCKET=`terraform output website_bucket`
if [ -n "$WEBSITE_BUCKET" ]; then
    echo $WEBSITE_BUCKET
    aws s3 sync frontend/public/ s3://$WEBSITE_BUCKET/ --profile personal \
        --exclude index.html \
        --exclude favicon.ico \
        --exclude manifest.json

    yarn build > logs/build.log 2>&1
    aws s3 sync frontend/build/ s3://$WEBSITE_BUCKET/ --profile personal > logs/upload.log 2>&1
    echo "{}"
else
    echo "No Website Bucket set in env"
    env
fi
