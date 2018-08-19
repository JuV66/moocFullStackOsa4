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
  likes: Number,
  users: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

blogSchema.statics.format = function(blog) {
  //console.log('blog: ', blog)
  //console.log('cb: ', cb)

  return {
    title: blog.title,
    author : blog.author,
    url : blog.url,
    likes : blog.likes,
    id: blog._id,
    users : blog.users
  }
}

const Blog = mongoose.model('Blog', blogSchema,)

module.exports = Blog