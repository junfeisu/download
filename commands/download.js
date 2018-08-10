const request = require('https').get
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const md5 = crypto.createHash('md5')

let source = ''
let dest = ''
let fileName = ''

const parseArgs = (args) => {
  let { url, dest, name } = args
  if (!url) {
    console.error('\033[;33m [sd-error]: \033[;31m download file url must be given.')
    return
  }

  source = url
  dest = path.resolve(process.env.PWD, dest)
  if (name) {
    fileName = name
  }

  download()
}

const download = () => {
  request(source, (res) => {
    let contentType = res.headers['content-type']
    let fileType = contentType.replace(/\w+\//, '')
    if (!fileName) {
      let matchReg = new RegExp('http(s)?:.+\.' + fileType, 'i')
      let extractReg = /http(s)?:.+\/(?=(\w+)\.)/
      if (matchReg.test(source)) {
        fileName = source.replace(extractReg, (match, $1, $2) => {
          return ''
        })
      } else {
        md5.update(source)
        fileName = 'sj-' + md5.digest('hex').slice(0, 7)
      }
    }
    let file = fs.createWriteStream(path.join(dest, fileName + '.' + fileType))
    res.pipe(file)
  })
}

module.exports = parseArgs
