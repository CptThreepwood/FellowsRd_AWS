cd ./frontend
yarn build
cd build

cd ../..
terraform init
terraform apply

WEBSITE_BUCKET=`terraform output website_bucket`
echo $WEBSITE_BUCKET
aws s3 sync ./frontend/public/ s3://$WEBSITE_BUCKET/ \
    --exclude index.html \
    --exclude favicon.ico \
    --exclude manifest.json