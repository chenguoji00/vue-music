const express = require('express')
const registerRouter = require('./router')

const port = process.env.PORT || 2000

const app = express()

registerRouter(app)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
