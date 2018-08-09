const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const config = require('./utils/config')
const mongoose = require('mongoose')

const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blog')

/*if (url === undefined) {
  console.log ("DB URL: ", url)
  return -1
}
*/
mongoose
  .connect(config.mongoUrl, { useNewUrlParser: true },err => {
    if (err) {
      console.log ('DB error URL: ', config.mongoUrl)
      throw err
    }
    console.log('Successfully connected to database.')
  })

app.use(cors())
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.json())

app.use(express.static('build')) // tarvitaan siihen että fortti koodi saadaan ajettua

app.use(middleware.logger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}