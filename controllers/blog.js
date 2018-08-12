const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({})
  response.json(blogs)

})

blogsRouter.get('/:id', async (request, response) => {

  console.log('reques: ' + request.params.id)
  const blog = await Blog.findById(request.params.id,{})
  console.log('blogById: ' + blog)
  response.json(blog)

})

blogsRouter.delete('/:id', async (request, response) => {

  console.log('reques: ' + request.params.id)
  const blog = await Blog.findByIdAndRemove(request.params.id,{})
  console.log('blogById: ' + blog)
  response.json(blog)

})

blogsRouter.put('/:id', async (request, response) => {

  const updateBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateBlog, {new:true })
  response.json(updatedBlog)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.title === undefined ) {
      return response.status(400).json({ error: 'content missing' })
    }
    if (body.url === undefined ) {
      return response.status(400).json({ error: 'content missing' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes
    })

    const savedBlog = await blog.save({})

    response.status(201).json(savedBlog)
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = blogsRouter