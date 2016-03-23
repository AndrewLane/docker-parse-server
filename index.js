'use strict'

const app = require('express')()
const ParseServer = require('parse-server').ParseServer
const url = require('url')

const env = process.env
const serverURL = env.SERVER_URL !== 'required' ? env.SERVER_URL : env.VIRTUAL_HOST
const mountPath = url.parse(serverURL).pathname || '/'

app.use(mountPath, new ParseServer({
  appId: env.APP_ID,
  cloud: env.CLOUD,
  databaseURI: env.DATABASE_URI,
  masterKey: env.MASTER_KEY,
  port: +env.PORT,
  serverURL
}))

app.listen(env.PORT, () => {
  console.log(`Parse Server UP and running on port ${env.PORT}.
Accessible at: ${serverURL}

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

