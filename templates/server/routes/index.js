const express = require('express')
const route = express.Router()

route.get('/', (req, res) => {
  res.send('welcome to sj init server.')
})

module.exports = route
