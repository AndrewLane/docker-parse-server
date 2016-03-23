# [Parse Server](https://github.com/ParsePlatform/parse-server)

See above for all documentation.

The docker image is updated whenever Node.js is updated, so it should keep fairly fresh.

Parse listens on the root of the server, _not_ `/parse` as in the examples, so it can be easily composed with other services.

## Env

- `APP_ID` Required
- `CLOUD` Defaults to /cloud/main.js
- `DATABASE_URI` Defaults to mongodb://mongo
- `MASTER_KEY` Required
- `PORT` Defaults to 1337, coerced to a number
- `SERVER_URL` Required, but will use `VIRTUAL_HOST` if present

## Volume

- /cloud (By default contains an empty main.js)

## Port

Exposes 1337 by default.

