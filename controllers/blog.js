const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog
    .find({})
    .populate('users', { username: 1, name: 1 })

  //console.log('Blogs: ' , blogs)
  //console.log('Blogs_likes: ' , blogs.likes)
  
  const sortedBlogs = blogs.sort(function(a,b) {
    if(a.likes > b.likes)  return 1
    if(a.likes > b.likes) return -1
    return 0
  })

  //console.log('sortedBlogs:', sortedBlogs)
  response.json(sortedBlogs.map(Blog.format))

})

blogsRouter.get('/:id', async (request, response) => {

  console.log('reques: ' + request.params.id)
  const blog = await Blog.findById(request.params.id,{})
  console.log('blogById: ' + blog)
  response.json(Blog.format(blog))

})

blogsRouter.delete('/:id', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log('decodedToken: ' + decodedToken)
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  console.log('reques: ' + request.params.id)

  const blog = await Blog.findById(request.params.id,{})
  console.log('blogById: ' + blog)
  console.log('blog.users: ' +blog.users)
  console.log('decodedToken.id :' +decodedToken.id )

  if ( blog.users.toString() === decodedToken.id.toString() ){
    console.log('poisto' )
    const blog = await Blog.findByIdAndRemove(request.params.id,{})
    response.json(Blog.format(blog))
  }else{
    console.log('ei poisteta')
    return response.status(300).json({ error: 'invalid user' })
  }

})

blogsRouter.put('/:id', async (request, response) => {

  const updateBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateBlog, { new:true })
  response.json(Blog.format(updatedBlog))
})

blogsRouter.post('/', async (request, response) => {
  try {

    const body = request.body
    //const token = getTokenFrom(request)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log('decodedToken: ' + decodedToken)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (body.title === undefined ) {
      return response.status(400).json({ error: 'content miusing' })
    }
    if (body.url === undefined ) {
      return response.status(400).json({ error: 'content missing' })
    }

    const user = await User.findById(decodedToken.id)
    //const allUser = await User.find({})
    //const user = allUser[1]

    console.log('user##: ' + user)
    console.log('userID: ' + user.id)
    console.log('\n')
    console.log('\n')

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      adult : body.adult,
      likes: body.likes === undefined ? 0 : body.likes,
      //users : user._id
      users : user.id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(Blog.format(savedBlog))
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }
})

module.exports = blogsRouter