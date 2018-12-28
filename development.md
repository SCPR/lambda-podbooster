# Why docker?

Because differences in machine architecture, the files to be uploaded to lambda (like node_modules) must all be built in an Amazon Linux 2 Docker container so that the Lame bindings work in lambda.

## Steps to develop:

1. build the docker image locally: `docker build -f Dockerfile . -t scprdev/lambda-podbooster`
1. run the image: `docker run -v path/to/this/repo/podbooster:/working -it scprdev/lambda-podbooster:latest`
1. note in the previous step that the path is to the `podbooster` directory in this current repo, not the repo root. We're mapping that to the '/working` directory in the docker container.
1. the previous `docker run` command should have created a new `lambda.zip` file in the repo root (check the timestamp to verify)
1. run `./publish.sh` to publish that `lambda.zip` to AWS lambda