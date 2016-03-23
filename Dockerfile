FROM node
MAINTAINER McKay Software <opensource@mckaysoftware.co.nz>

CMD ["node", "."]
EXPOSE 1337
WORKDIR /parse

RUN mkdir -p cloud && touch cloud/main.js
VOLUME /parse/cloud

ENV APP_ID required
ENV CLOUD ./cloud/main.js
ENV DATABASE_URI mongodb://mongo
ENV MASTER_KEY required
ENV PORT 1337
ENV SERVER_URL required

ADD index.js package.json /parse/
RUN npm install
