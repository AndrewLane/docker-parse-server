'use strict'

const app = require('express')()
const env = process.env
const ParseServer = require('parse-server').ParseServer
const url = require('url')

// HAProxy passes on the full URL, so for example if we proxy the app onto
// https://parse.example.com/appname/dev/ express is going to see that as
// http://17.0.1.2:1337/appname/dev/. Thus we need to mount at that URL.
const mountPath = url.parse(env.SERVER_URL).pathname || '/'

app.use(mountPath, new ParseServer({
  appId: env.APP_ID,
  cloud: env.CLOUD,
  databaseURI: env.DATABASE_URI,
  masterKey: env.MASTER_KEY,
  port: +env.PORT,
  serverURL: env.SERVER_URL
}))

app.listen(env.PORT, () => {
  console.log(`Parse Server UP and running on port ${env.PORT}.
Accessible at: ${env.SERVER_URL}

          ՝--://////:-.
       -/ooooooooooooooo+:՝
    ՝:ooooooooooooooooooooo/.
   -+ooooooooooo+/:::/+oooooo/՝
  :ooooooooooo+. .:::-՝՝:ooooo+՝
 .ooooooooooo/ .+oooooo: -ooooo+
 +ooooooooooo՝ +oooooooo՝ oooooo-
՝oooooooooooo  oooooooo/ ՝oooooo:
՝oooooooooo+++++RIP++/- .+oooooo:
 +oooooo:՝՝՝՝՝՝՝՝՝՝՝.-:+oooooooo-
 .ooooo+ ՝ooo//oooooooooooooooo+
  :ooooo. -:. :ooooooooooooooo+՝
  -+oooo+///+ooooooooooooooo/՝
    ՝:ooooooooooooooooooooo/.
       ./ooooooooooooooo+:՝
         ՝--://////:-.
  `)
})

