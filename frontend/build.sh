#!/bin/bash

WEBSITE_BUCKET=$1

yarn build > logs/build.log 2>&1
aws s3 sync ./build/ s3://$WEBSITE_BUCKET/ > logs/upload.log 2>&1
echo "{}"