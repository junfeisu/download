const request = require('request')
const fs = require('fs')
const path = require('path')

const parseArgs = (args) => {
  console.log(args)
}

module.exports = parseArgs

// request('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png')
//   .pipe(fs.createWriteStream(path.resolve('./test.png')))