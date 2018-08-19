const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, likes: 1 })
  response.json(users.map(User.format))
})

usersRouter.post('/', async (request, response) => {
  try {

    const body = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    if (body.password.length < 3 ) {
      return response.status(400).json({ error: 'password too short' })
    }

    //console.log('username: ' + body.username +'\n' +'\n')
    const uniikki = await User.find({ username : body.username })

    if(uniikki.length !== 0 ){
      return response.status(400).json({ error: 'username is no unque' })
    }
  
    const user = new User({
      username: body.username,
      name: body.name,
      adult : body.adult === undefined ? 0 : body.adult,
      passwordHash : passwordHash
    })

    const savedUser = await user.save()

    response.json(User.format(savedUser))
  } catch (exception) {
    //console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter