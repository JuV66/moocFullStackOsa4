const logger = (request, response, next) => {
  if ( process.env.NODE_ENV === 'test' ) {
    return next()
  }
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  console.log ('authorization: ' +authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
    console.log('request.token: ' + request.token)
    return next() //authorization.substring(7)
  }
  return next()
}


module.exports = {
  logger,
  error,
  tokenExtractor
}