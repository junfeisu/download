const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const md5 = crypto.createHash('md5')
const progressBar = require('progress')
const inquirer = require('inquirer')
const chalk = require('chalk')

let source = ''
let dest = ''
let fileName = ''
let request = null

// 对命令行参数的处理
const parseArgs = (args) => {
  let { url, dest, name } = args
  if (!url) {
    console.error(chalk.yellow('[sd-error]:'), chalk.red('download file url must be given.'))
    return
  }

  source = url
  request = /^https/.test(source) ? https.get : http.get
  dest = path.resolve(process.env.PWD, dest)
  if (name) {
    fileName = name
  }

  download()
}

/*
 当没有提供文件的名称时我们会自动添加文件名
 1. 如果地址自带文件后缀名，我们从地址里取文件名
 2. 如果地址没有带后缀名，那么我们就会生成一个md5然后截取前7位，然后在前面加上sj-
 */
const handleFileName = (fileType) => {
  let matchReg = new RegExp('http(s)?:.+\.' + fileType, 'i')
  let extractReg = /http(s)?:.+\/(?=(\w+)\.)/

  if (matchReg.test(source)) {
    source.replace(extractReg, (match, $1, $2) => {
      fileName = $2
    })
  } else {
    md5.update(source)
    fileName = 'sj-' + md5.digest('hex').slice(0, 7)
  }
}

// 当需要下载的文件存放的位置同在同名文件，询问是否需要替换
const replaceFile = async (res) => {
  res.pause()
  
  let questionStr = 'The ' + fileName + ' alerady exists in ' + dest + '. Would you replace it [Y/N]?'
  let questionResult = await inquirer.prompt([{
    type: 'exist',
    name: 'replaceOrigin',
    message: questionStr
  }])

  let flag = questionResult.replaceOrigin
  if (!flag || (flag.toUpperCase() !== 'Y' && flag.toUpperCase() !== 'N')) {
    replaceFile(res)
    return
  }

  if (questionResult.replaceOrigin.toUpperCase() !== 'Y') {
    process.exit(1)
  }

  res.resume()
}

const download = () => {
  request(source, async (res) => {
    let contentType = res.headers['content-type']
    let fileType = contentType.replace(/\w+\//, '')
    let bar = new progressBar('  downloading [:bar] :rate/bps :percent :etas', {
      total: parseInt(res.headers['content-length'], 10),
      complete: '=',
      incomplete: ' ',
      width: 20,
    })
    
    if (!fileName) {
      handleFileName(fileType)
    }

    let filePath = path.join(dest, fileName + '.' + fileType)
    if (fs.existsSync(filePath)) {
      replaceFile(res)
    }

    let file = fs.createWriteStream(filePath)

    res.on('data', data => {
      bar.tick(data.length)
      file.write(data)
    })

    res.on('end', () => {
      console.log(chalk.green('  download finish! \n'))
      file.end()
    })
  })
}

module.exports = parseArgs
