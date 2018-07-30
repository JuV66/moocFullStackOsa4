const mongoose = require('mongoose')

/*
const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})
*/

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.statics.format = function(blog, cb) {
  console.log('blog: ', blog)
  console.log('cb: ', cb)

  return {
    title: blog.title,
    author : blog.author,
    url : blog.url,
    likes : blog.likes,
    id: blog._id
  }
}

const Blog = mongoose.model('BlogList', blogSchema)

module.exports = Blog