const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)
const User = require('../models/user')

const {
  initialBlogs,
  initialOneBlogs,
  addedBlog,
  emptyLikesBlog,
  Bad400Blog,
  format, 
  nonExistingId, 
  blogsInDB,
  usersInDb
} = require('./test_helper')



describe('when there is initially one user at db', async () => {
  beforeAll(async () => {
    //await User.remove({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      adult : false,
      password: 'salainen'
    }

    await api
    
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('POST /api/users too short password', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      adult : false,
      password: 'sa'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/username unique', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      adult : true,
      password: 'sa'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/username missing adult', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'mluukkai2',
      name: 'Matti Luukkainen',
      password: 'sanaSalainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
  })
})