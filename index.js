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
  clientKey: env.CLIENT_KEY,
  cloud: env.CLOUD,
  databaseURI: env.DATABASE_URI,
  masterKey: env.MASTER_KEY,
  port: +env.PORT,
  serverURL: env.SERVER_URL
}))

app.listen(env.PORT, () => {
  console.log(`
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
 .ooooo+ ՝ooo//oooooooooooooooo+
  :ooooo. -:. :ooooooooooooooo+՝
  -+oooo+///+ooooooooooooooo/՝
    ՝:ooooooooooooooooooooo/.
       ./ooooooooooooooo+:՝
         ՝--://////:-.
  `)
})

