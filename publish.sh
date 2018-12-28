#!/bin/bash

rm lambda.zip
cd podbooster
zip -X -r ../lambda.zip .
cd ..
echo "Uploading lambda to AWS..."
aws lambda update-function-code --function-name podBooster --zip-file fileb://lambda.zip
