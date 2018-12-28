#!/usr/bin/bash

cd /working/podbooster

echo "Removing old /node_modules"
rm -rf node_modules

echo "Removing old lambda.zip"
rm ../lambda.zip

echo "NPM install"
npm install

zip -X -r ../lambda.zip .

echo "TADA!! Created new lambda.zip"