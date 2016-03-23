FROM node
MAINTAINER McKay Software <opensource@mckaysoftware.co.nz>

ENTRYPOINT ["/usr/local/bin/parse-server"]
EXPOSE 1337
RUN npm install -g parse-server

