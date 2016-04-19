'use strict'

const app = require('express')()
const bunyan = require('bunyan')
const env = process.env
const ParseServer = require('parse-server').ParseServer
const url = require('url')

// HAProxy passes on the full URL, so for example if we proxy the app onto
// https://parse.example.com/appname/dev/ express is going to see that as
// http://17.0.1.2:1337/appname/dev/. Thus we need to mount at that URL.
const mountPath = url.parse(env.SERVER_URL).pathname || '/'

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

app.use(mountPath, new ParseServer(config))

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
  :ooooo. -:. :ooooooooooooooo+՝
  -+oooo+///+ooooooooooooooo/՝
    ՝:ooooooooooooooooooooo/.
       ./ooooooooooooooo+:՝
         ՝--://////:-.
  `)
})

