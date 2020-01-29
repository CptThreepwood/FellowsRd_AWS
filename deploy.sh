<<<<<<< HEAD
#!/bin/bash
=======
cd ./frontend
yarn build
cd build

cd ../..
>>>>>>> 1759f2e656ea279ff6e638e6084e53a69cb34730
terraform init
terraform apply

WEBSITE_BUCKET=`terraform output website_bucket`
if [ -n "$WEBSITE_BUCKET" ]; then
    cd ./frontend
    echo $WEBSITE_BUCKET
    aws s3 sync ./frontend/public/ s3://$WEBSITE_BUCKET/ \
        --exclude index.html \
        --exclude favicon.ico \
        --exclude manifest.json

    yarn build > logs/build.log 2>&1
    aws s3 sync ./frontend/build/ s3://$WEBSITE_BUCKET/ > logs/upload.log 2>&1
    echo "{}"
else
    echo "No Website Bucket set in env"
    env
fi
