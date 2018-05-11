#!/bin/bash

aws s3 sync ./build/ s3://fellowsrd.com/ --profile serverless_personal --exclude ".git/*" --exclude "backend/*"
