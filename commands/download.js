const request = require('https').get
const fs = require('fs')
const path = require('path')

let source = ''
let dest = ''
let fileName = ''

const parseArgs = (args) => {
  let { url, dest, name } = args
  if (!url) {
    console.error('[sd-error]: download file url must be given.')
    return
  }

  source = url
  dest = path.join(process.env.PWD, dest)
  if (name) {
    fileName = name
  }

  download()
}

const download = () => {
  request(source, (res) => {
    let headers = res.headers
    let contentType = headers['content-type']
    let fileType = contentType.replace(/\w+\//, '')
    let file = fs.createWriteStream(path.join(dest, fileName + '.' + fileType))
    res.pipe(file)
  })
}

module.exports = parseArgs
