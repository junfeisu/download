const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const md5 = crypto.createHash('md5')
const progressBar = require('progress')
const inquirer = require('inquirer')
const chalk = require('chalk')
const unzip = require('unzip')
const fileTable = require('../constants/fileTable.json')

let source = ''
let destPath = ''
let fileName = ''
let extractPath = ''
let request = null

// 对命令行参数的处理
const parseArgs = (args) => {
  let { url, dest, name, extract } = args
  if (!url) {
    console.error(chalk.yellow('[sj-error]:'), chalk.red('download file url must be given.'))
    return
  }

  source = url
  request = /^https/.test(source) ? https.get : http.get
  destPath = path.resolve(process.env.PWD, dest)
  if (extract) {
    extractPath = path.resolve(process.env.PWD, extract)
  }
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
  let matchReg = new RegExp('http(s)?:.+\\.' + fileType, 'i')
  let extractReg = new RegExp('http(s)?:.+/(?=(.+)\\.' + fileType + ')', 'i')

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
  
  let questionStr = 'The ' + fileName + ' alerady exists in ' 
    + destPath + '. Would you replace it [Y/N]?'
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

// const askUnzip = async (filePath) => {
//   let questionStr = 'Download file is a zip file, Do you want to unzip it?'
//   let questionResult = await inquirer.prompt([{
//     type: 'unzip',
//     name: 'isUnzip',
//     message: questionStr,
//     validate: value => {
//       if (!value || (value.toUpperCase() !== 'Y' && value.toUpperCase() !== 'N')) {
//         console.warn(chalk.yellow('   [sj-warning]: Please enter Y(y) or N(n)'))
//       } else {
//         return true
//       }
//     }
//   }])

//   if (questionResult.isUnzip.toUpperCase() !== 'Y') {
//     process.exit(0)
//   }

//   let extractPathStr = 'Please specify the path to extract files'
//   let extractQuestionAnswer = await inquirer.prompt([{
//     type: 'extract',
//     name: 'extractPath',
//     message: extractPathStr,
//     validate: extractPath => {
//       let resolvedPath = path.resolve(process.env.PWD, extractPath)
//       if (!fs.existsSync(resolvedPath)) {
//         let existedMes = '   [sj-warning]: the path ' + resolvedPath + ' is not exist'
//         console.warn(chalk.yellow(existedMes))
//       } else {
//         return true
//       }
//     }
//   }])

//   unzipFile(filePath, extractQuestionAnswer.extractPath)
// }

const unzipFile = (filePath) => {
  fs.createReadStream(filePath).pipe(unzip.Extract({path: extractPath}))
}

const download = () => {
  request(source, async (res) => {
    let contentType = res.headers['content-type']
    if (contentType.indexOf(';') >= 0) {
      contentType = contentType.split(';')[0]
    }

    let fileType = fileTable[contentType]
    let bar = new progressBar('  downloading [:bar] :rate/bps :percent :etas', {
      total: parseInt(res.headers['content-length'], 10),
      complete: '=',
      incomplete: ' ',
      width: 20,
    })
    
    if (!fileName) {
      handleFileName(fileType)
    }

    let filePath = path.resolve(destPath, fileName + '.' + fileType)
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
      if (fileType === 'zip' && extractPath) {
        unzipFile(filePath)
      }
    })
  })
}

module.exports = parseArgs
