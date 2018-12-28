FROM amazonlinux:latest

WORKDIR /working

RUN yum update -y && yum groupinstall -y "Development Tools"

RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash \
    && yum install -y nodejs-8.10.0 zip

COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]