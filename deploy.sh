cd ./frontend
yarn build
cd build
MAIN_JS=`ls static/js/main.*.js`
MAIN_JS_MAP=`ls static/js/main.*.js.map`
MAIN_CSS=`ls static/css/main.*.css`
MAIN_CSS_MAP=`ls static/css/main.*.css.map`
echo "main_js=${MAIN_JS}"
echo "main_js_map=${MAIN_JS_MAP}"
echo "main_css=${MAIN_CSS}"
echo "main_css_map=${MAIN_CSS_MAP}"

cd ../..
terraform init
terraform apply \
    -var "main_js_filepath=${MAIN_JS}" \
    -var "main_js_map_filepath=${MAIN_JS_MAP}" \
    -var "main_css_filepath=${MAIN_CSS}" \
    -var "main_css_map_filepath=${MAIN_CSS_MAP}"

WEBSITE_BUCKET=`terraform output website_bucket`
echo $WEBSITE_BUCKET
aws s3 sync ./frontend/public/ s3://$WEBSITE_BUCKET/ \
    --exclude index.html \
    --exclude favicon.ico \
    --exclude manifest.json