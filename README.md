# [Parse Server](https://github.com/ParsePlatform/parse-server)

See above for all documentation.

Parse listens on the path given in `SERVER_URL`, if any, ***not*** `/parse`
as in the upstream examples, so it can be easily served from HAProxy and
composed with other services. For example with multiple apps and envs:

    https://parse.example.com/appname/prod/
    https://parse.example.com/appname/dev/
    https://parse.example.com/anotherapp/prod/

## Env

- `APP_ID` **Required**
- `CLIENT_KEY` **Required**
- `CLOUD` Defaults to /cloud/main.js
- `DATABASE_URI` Defaults to mongodb://mongo, so you can link to mongo easily
- `MASTER_KEY` **Required**
- `PORT` Defaults to 1337, coerced to a number
- `SERVER_URL` **Required**

## Volume

- /cloud (By default contains an empty main.js)

## Port

Exposes 1337 by default.

