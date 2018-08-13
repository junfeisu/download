
const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cons = require('consolidate')
const app = express()
const indexRoute = require('./routes/index')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '/static/dist')))
app.use('/api/index', indexRoute)

app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

const server = app.listen(4000, () => {
  let host = server.address().address
  let port = server.address().port
  console.log(`Server start at ${host}:${port}`)
})

module.exports = app
