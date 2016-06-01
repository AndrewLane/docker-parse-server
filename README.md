# [Parse Server]

See above for all documentation.

Parse listens on the path given in `SERVER_URL`, if any, ***not*** `/parse`
as in the upstream examples, so it can be easily served from HAProxy and
composed with other services. For example with multiple apps and envs:

    https://parse.example.com/appname/prod/
    https://parse.example.com/appname/dev/
    https://parse.example.com/anotherapp/prod/

Logs are written to STDOUT in "pretty" [Bunyan] format, and to file in "raw"
JSON format. The welcome message is written to STDERR to not interfere.

[Bunyan]: https://github.com/trentm/node-bunyan
[Parse Server]: https://github.com/ParsePlatform/parse-server

## Env

- `APP_ID` **Required**
- `APP_NAME` Optional. Sets both the Parse internal app name, and in the logs
- `CLIENT_KEY` **Required**
- `CLOUD` Defaults to /cloud/main.js
- `DATABASE_URI` Defaults to mongodb://mongo, so you can link to mongo easily
- `MASTER_KEY` **Required**
- `PORT` Defaults to 1337, coerced to a number
- `PUBLIC_SERVER_URL` Public-facing URL for server, defaults to `SERVER_URL`
- `SERVER_URL` **Required**

### Mailgun (optional)

- `MAILGUN_DOMAIN` Mailgun domain
- `MAILGUN_FROM` Mailgun From address
- `MAILGUN_KEY` Mailgun API key

## Volume

- /parse/cloud (By default contains an empty main.js)
- /parse/logs (Logs named `parse.log` and rotated every day)

## Port

Exposes 1337 by default.
