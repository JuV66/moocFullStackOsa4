const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const middleware = require('./utils/middleware')




const blogsRouter = require('./controllers/blog')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')

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
app.use(middleware.tokenExtractor)

console.log('loginRouter')

app.use('/api/login', loginRouter)
console.log('blogRouter')
app.use('/api/blogs', blogsRouter)
console.log('userRouter')
app.use('/api/users', usersRouter)

app.use(middleware.error)

const server = http.createServer(app)

// console.log('config.port: ' +config.port)

try {
  console.log('process.env.NODE_ENV : ' +process.env.NODE_ENV )
  if (process.env.NODE_ENV !== 'test') {
    server.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`)

    })
  }
} catch (exception) {
  console.log(exception)
  console.log(`Server error, try used port ${config.port}`)
}

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}