# lambda-podbooster

Here's a basic breakdown of the folder structure for this repo:

```bash
.
├── README.md                   <-- This instructions file
├── podbooster                  <-- Source code for a lambda function
│   ├── index.js                <-- Lambda function code
│   ├── package.json            <-- NodeJS dependencies
│   └── tests                   <-- Unit tests
│       └── unit
│           └── test_handler.js
└── template.yaml               <-- SAM template
```

## Requirements

* AWS CLI already configured with Administrator permission
* [NodeJS 8.10+ installed](https://nodejs.org/en/download/)
* [Docker installed](https://www.docker.com/community-edition)

## Setup process

### Building the project

[AWS Lambda requires a flat folder](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html) with the application as well as its dependencies in a node_modules folder. When you make changes to your source code or dependency manifest,
run the following command to build your project local testing and deployment:

```bash
sam build --use-container
```

By default, this command writes built artifacts to `.aws-sam/build` folder.

### Local development

**Invoking function locally through local API Gateway**

```bash
sam local start-api
```

If the previous command ran successfully you should now be able to hit the following local endpoint to invoke your function `http://localhost:3000/podbooster`

## Testing

We use `mocha` for testing our code and it is already added in `package.json` under `scripts`, so that we can simply run the following command to run our tests:

```bash
cd podbooster
npm install
npm run test
```

# Why docker?

Because differences in machine architecture, the files to be uploaded to lambda (like node_modules) must all be built in an Amazon Linux 2 Docker container so that the Lame bindings work in lambda.

## Steps to develop:

1. build the docker image locally: `docker build -f Dockerfile . -t scprdev/lambda-podbooster`
1. run the image: `docker run -v path/to/this/repo/podbooster:/working -it scprdev/lambda-podbooster:latest`
1. note in the previous step that the path is to the `podbooster` directory in this current repo, not the repo root. We're mapping that to the '/working` directory in the docker container.
1. the previous `docker run` command should have created a new `lambda.zip` file in the repo root (check the timestamp to verify)
1. run `./publish.sh` to publish that `lambda.zip` to AWS lambda
