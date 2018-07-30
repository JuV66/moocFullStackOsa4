//const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const middleware = require('./utils/middleware')
const personsRouter = require('./controllers/blog')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

/*if (url === undefined) {
  console.log ("DB URL: ", url)
  return -1
}
*/
mongoose.connect(url, { useNewUrlParser: true },err => {
  if (err) {
    console.log ('DB error URL: ', url)
    throw err
  }
  console.log('Successfully connected to database.')
})

app.use(cors())
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.json())

app.use(express.static('build')) // tarvitaan siihen että fortti koodi saadaan ajettua

app.use(middleware.logger)

app.use('/api/blogs', personsRouter)

app.use(middleware.error)


const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  //console.log(`Server running on port ${PORT}`)
})