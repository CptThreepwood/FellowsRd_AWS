#!/bin/bash

WEBSITE_BUCKET=$1

yarn build > /dev/null 2>&1
cd build
MAIN_JS=`ls static/js/main.*.js`
MAIN_JS_MAP=`ls static/js/main.*.js.map`
MAIN_CSS=`ls static/css/main.*.css`
MAIN_CSS_MAP=`ls static/css/main.*.css.map`

cd ..
aws s3 sync ./public/ s3://$WEBSITE_BUCKET/ \
    --exclude index.html \
    --exclude favicon.ico \
    --exclude manifest.json \
    --quiet

echo "{\"main_js\": \"${MAIN_JS}\", \"main_js_map\": \"${MAIN_JS_MAP}\", \"main_css\": \"${MAIN_CSS}\", \"main_css_map\": \"${MAIN_CSS_MAP}\"}"