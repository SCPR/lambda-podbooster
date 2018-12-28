#!/bin/bash

echo "Uploading lambda to AWS..."
aws lambda update-function-code --function-name podBooster --zip-file fileb://lambda.zip
