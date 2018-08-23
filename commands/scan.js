const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const staticResourceTable = {}

let ignorePwds = []
let rootPwd = ''
let relativePwd = ''
let specifiedDest = ''
let specifiedName = 'staticResource'
let lastDirectory = null

const parseArgs = (args) => {
  const { root, name, relative, ignore, dest } = args
  
  if (!root) {
    console.error(chalk.yellow('[sj-error]:'), chalk.red('scan directory must be given.'))
    return
  }

  rootPwd = path.resolve(process.env.PWD, root)
  relativePwd = relative ? path.resolve(rootPwd, relative) : rootPwd
  specifiedDest = dest ? path.resolve(rootPwd, dest) : rootPwd

  if (ignore) {
    let ignores = ignore.split('~')
    ignores.forEach(value => {
      ignorePwds.push(value)
    })
  }
  if (name) {
    specifiedName = name
  }

  next(relativePwd)
}

const removeIgnorePwds = (pwd, files) => {
  let hasFound = false
  for (let i = files.length - 1; i >= 0; i--) {
    let isDirectory = fs.statSync(path.resolve(pwd, files[i])).isDirectory()
    if (isDirectory) {
      if (ignorePwds.includes(files[i])) {
        files.splice(i, 1)
      } else {
        if (pwd === relativePwd && !hasFound) {
          lastDirectory = files[i]
          hasFound = true
        }
      }
    }
  }
}

// 递归遍历指定目录
const next = (pwd) => {
  let files = fs.readdirSync(pwd)
  let staticFileReg = /^.+(\.css|\.png|\.jpg|\.jpeg|\.svg|\.ttf|\.scss|\.less)$/i
  
  removeIgnorePwds(pwd, files)

  files.forEach((file, index) => {
    let isDirectory = fs.statSync(path.resolve(pwd, file)).isDirectory()
    if (isDirectory) {
      next(path.resolve(pwd, file))
    } else {
      if (staticFileReg.test(file)) {
        if (path.resolve(pwd) === path.resolve(rootPwd)) {
          staticResourceTable[file] = file
        } else {
          staticResourceTable[path.join(pwd.replace(rootPwd, ''), file)] = path.join(pwd.replace(rootPwd, ''), file)
        }
      }
      if (pwd === path.resolve(relativePwd, lastDirectory) && index === files.length - 1) {
        generateJosnFile()
      }
    }
  })
}

const generateJosnFile = () => {
  let fileName = specifiedName + '.json'
  fs.open(path.resolve(rootPwd, fileName), 'w+', null, (e, fd) => {
    if (e) {
      console.log('create json file err', e)
      return
    }
    fs.write(fd, JSON.stringify(staticResourceTable, null, 2), (error) => {
      error ? console.log('write err', error) : console.log('add json success')
      fs.closeSync(fd)
    })
  })
}

module.exports = parseArgs
