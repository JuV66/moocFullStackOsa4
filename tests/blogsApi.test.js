const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { 
  initialBlogs,
  initialOneBlogs,
  addedBlog,
  emptyLikesBlog,
  Bad400Blog,
  format, 
  nonExistingId, 
  blogsInDB } = require('./test_helper')

describe('test', async () => {
  beforeAll(async () => {
    await Blog.remove({})

    let blogObject = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObject.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {

    const blogsInDataBase = await blogsInDB()

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.length).toBe(blogsInDataBase.length)

    const returnedContents = response.body.map(n => n.title)
    blogsInDataBase.forEach(blog => {
      expect(returnedContents).toContain(blog.title)
    })
  })


  test('the first blogs', async () => {
    const response = await api
      .get('/api/blogs')
    //console.log('body: ' + response.body[0].title )
    const title = response.body.map(b => b.title)
    console.log(title )
    expect(title).toContain('React patterns' )
  })

  test('add new blog', async () => {
    const blogsAtStart = await blogsInDB()
    await api
      .post('/api/blogs')
      .send(addedBlog)
      .expect(201)

    const blogsAfterOperation = await blogsInDB()

    expect(blogsAfterOperation.length).toBe(blogsAtStart.length +1)

    const titles = blogsAfterOperation.map(r => r.title)
    expect (titles).toContain('lisätty blog')

  })

  test('add new blog with empty likes', async () => {
    //console.log('emptyLikesBlog.title: ' + emptyLikesBlog.title)
    const response = await api
      .post('/api/blogs')
      .send(emptyLikesBlog)
      .expect(201)
    const body = response.body
    //console.log('savedBlog: ' + new Blog(body) )
    //console.log('\n')
    //console.log('\n')
    //console.log('\n')

    expect(body.likes).toBe(0)
  })

  test('400 bad request', async () => {
    //console.log('emptyLikesBlog.title: ' + emptyLikesBlog.title)
    const response = await api
      .post('/api/blogs')
      .send(Bad400Blog)
      .expect(400)
    //const body = response.body
    //console.log('savedBlog: ' + new Blog(body) )
    //console.log('\n')
    //console.log('\n')
    //console.log('\n')
  })

  test('return blogs with id' , async () => {
    const blogsInDataBase = await blogsInDB()
    const aBlog = blogsInDataBase[0]

    console.log('aBlog: ' + aBlog._id + '\n')
    console.log('\n')
    console.log('\n')
    console.log('\n')

    const response = await api
      .get('/api/blogs/' + aBlog._id)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    console.log('body: ' + response.body.title + '\n')
    console.log('\n')
    console.log('\n')
    expect(response.body.title).toBe(aBlog.title)

  })
})

describe('remove test', async () => {
  let addedBlog

  beforeAll(async () => {
    addedBlog = new Blog({
      title: 'addedBlogs',
      author: 'Mä',
      url: 'https://fmi.fi/',
      likes: 66,
    })
    await addedBlog.save()
  })

  test.only('remove blogs with id' , async () => {

    const blogsAtStart = await blogsInDB()

    blogsAtStart.map(o => console.log(o))
    //console.log ('start: ' + blogsAtStart )
    console.log('\n')

    await api
      .delete('/api/blogs/' + addedBlog._id)
      .expect(200)

    const blogsAfterOp = await blogsInDB()

    blogsAfterOp.map(o => console.log(o))
    console.log('\n')

    const titles = blogsAfterOp.map(r => r.title)

    expect(titles).not.toContain(addedBlog.title)
    expect(blogsAfterOp.length).toBe(blogsAtStart.length-1)


  })
})

describe('update test', async () => {
  let addedBlog

  beforeAll(async () => {
    addedBlog = new Blog({
      title: 'addedBlogs',
      author: 'Mä',
      url: 'https://fmi.fi/',
      likes: 66,
    })
    await addedBlog.save()
  })

  test.only('update blogs title with id' , async () => {

    const blogsAtStart = await blogsInDB()

    addedBlog.title = 'updatedBlog'

    blogsAtStart.map(o => console.log(o))
    //console.log ('start: ' + blogsAtStart )
    console.log('\n')

    await api
      .put('/api/blogs/' + addedBlog._id)
      .send(addedBlog)
      .expect(200)

    const blogsAfterOp = await blogsInDB()

    blogsAfterOp.map(o => console.log(o))
    console.log('\n')

    const titles = blogsAfterOp.map(r => r.title)

    expect(titles).toContain(addedBlog.title)
    expect(blogsAfterOp.length).toBe(blogsAtStart.length)


  })
})


afterAll(() => {
  server.close()
})