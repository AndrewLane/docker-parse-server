'use strict'

const app = require('express')()
const bunyan = require('bunyan')
const env = process.env
const ParseServer = require('parse-server').ParseServer
const url = require('url')

const log = bunyan.createLogger({
  name: env.APP_NAME || 'parse-server',
  streams: [
    { stream: process.stdout },
    {
      type: 'rotating-file',
      path: 'logs/parse.log',
      period: '1d',
      count: 30
    }
  ]
})

class Logger {
  constructor () {
    this.log = log.child({ component: 'parse' })
  }

  info () {
    this.log.info(...arguments)
  }

  error () {
    this.log.error(...arguments)
  }

  query (options, callback) {
    callback([])
  }
}

app.use(require('bunyan-middleware')({
  logger: log.child({ component: 'http' })
}))

const config = {
  appId: env.APP_ID,
  appName: env.APP_NAME,
  clientKey: env.CLIENT_KEY,
  cloud: env.CLOUD,
  databaseURI: env.DATABASE_URI,
  loggerAdapter: Logger,
  masterKey: env.MASTER_KEY,
  port: +env.PORT,
  publicServerURL: env.PUBLIC_SERVER_URL || env.SERVER_URL,
  serverURL: env.SERVER_URL
}

let mailer = '(none)'
if (env.MAILGUN_KEY && env.MAILGUN_DOMAIN && env.MAILGUN_FROM) {
  mailer = `Mailgun (${env.MAILGUN_FROM})`
  config.emailAdapter = {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      apiKey: env.MAILGUN_KEY,
      domain: env.MAILGUN_DOMAIN,
      fromAddress: env.MAILGUN_FROM
    }
  }
}

let storage = '(mongo)'
if (env.S3_ENDPOINT &&
    env.S3_ACCESS_KEY &&
    env.S3_SECRET_KEY &&
    env.S3_BUCKET) {
  storage = `${env.S3_ENDPOINT} (${env.S3_BUCKET})`
  config.filesAdapter = {
    module: 'parse-server-s3like-adapter',
    options: {
      accessKey: env.S3_ACCESS_KEY,
      bucket: env.S3_BUCKET,
      direct: (env.S3_DIRECT || 'no').startsWith('y'),
      endPoint: env.S3_ENDPOINT,
      secretKey: env.S3_SECRET_KEY
    }
  }
} else if (env.DROPBOX_TOKEN && env.DROPBOX_PUBLICURL) {
  storage = `Dropbox`
  config.filesAdapter = {
    module: 'parse-server-dropbox-adapter',
    options: {
      token: env.DROPBOX_TOKEN,
      prefix: env.DROPBOX_PREFIX || '',
      publicUrl: eval(env.DROPBOX_PUBLICURL) // eslint-disable-line no-eval
    }
  }
}

// HAProxy passes on the full URL, so for example if we proxy the app onto
// https://parse.example.com/appname/dev/ express is going to see that as
// http://17.0.1.2:1337/appname/dev/. Thus we need to mount at that URL.

const server = new ParseServer(config)
app.use(url.parse(env.SERVER_URL).pathname || '/', server)
if (env.ALT_SERVER_URL) {
  app.use(url.parse(env.ALT_SERVER_URL).pathname || '/', server)
}

app.listen(env.PORT, () => {
  console.error(`
          ՝--://////:-.
       -/ooooooooooooooo+:՝
    ՝:ooooooooooooooooooooo/.
   -+ooooooooooo+/:::/+oooooo/՝
  :ooooooooooo+. .:::-՝՝:ooooo+՝
 .ooooooooooo/ .+oooooo: -ooooo+
 +ooooooooooo՝ +oooooooo՝ oooooo-    Parse Server UP and running on port ${env.PORT}.
՝oooooooooooo  oooooooo/ ՝oooooo:    Accessible at: ${env.SERVER_URL}
՝oooooooooo+++++RIP++/- .+oooooo:    App ID: ${env.APP_ID}
 +oooooo:՝՝՝՝՝՝՝՝՝՝՝.-:+oooooooo-    Client Key: ${env.CLIENT_KEY}
 .ooooo+ ՝ooo//oooooooooooooooo+     Mailer: ${mailer}
  :ooooo. -:. :ooooooooooooooo+՝     Storage: ${storage}
  -+oooo+///+ooooooooooooooo/՝
    ՝:ooooooooooooooooooooo/.
       ./ooooooooooooooo+:՝
         ՝--://////:-.
  `)
})
