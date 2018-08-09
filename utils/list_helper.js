const dummy = (blogs) => {

  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return blog.likes === undefined ? 0 : sum + blog.likes
  }
  console.log(blogs)
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, blog) => {
    //console.log(max)
    //console.log(blogs)
    return blog.likes > max.likes  ?
      { title : blog.title, author : blog.author,likes : blog.likes } :
      { title : max.title, author : max.author, likes : max.likes }
  }
  return blogs.reduce(reducer, {  title: '', author: '', likes: 0 })
}

//kohdat 4.6 ja 4.7 tekemättä

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}

