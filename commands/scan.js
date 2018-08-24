const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

const staticResourceTable = {}

let ignorePwds = []
let rootPwd = ''
let relativePwd = ''
let specifiedDest = ''
let specifiedName = 'staticResource'
let lastDirectory = ''

const parseArgs = (args) => {
  const { root, name, relative, ignore, dest } = args
  
  if (!root) {
    console.error(chalk.yellow('[slj-error]:'), chalk.red('scan directory must be given.'))
    return
  }

  rootPwd = path.resolve(process.env.PWD, root)
  relativePwd = relative ? path.resolve(rootPwd, relative) : rootPwd
  specifiedDest = dest ? path.resolve(rootPwd, dest) : rootPwd

  if (ignore) {
    let ignores = ignore.split('~')
    ignores.forEach(value => {
      ignorePwds.push(path.resolve(relativePwd, value))
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
      if (ignorePwds.includes(path.resolve(pwd, files[i]))) {
        files.splice(i, 1)
      } else {
        if (!pwd.indexOf(lastDirectory) && !hasFound) {
          lastDirectory = path.resolve(pwd, files[i])
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
  
  if (!files.length) {
    console.warn(chalk.yellow('[slj-warning]: The directory you supported is a null directory'))
    return
  }

  removeIgnorePwds(pwd, files)

  files.forEach((file, index) => {
    let isDirectory = fs.statSync(path.resolve(pwd, file)).isDirectory()
    if (isDirectory) {
      next(path.resolve(pwd, file))
    } else {
      if (staticFileReg.test(file)) {
        if (pwd === rootPwd) {
          staticResourceTable[file] = file
        } else {
          let relativedPath = path.resolve(pwd, file).replace(rootPwd, '.')
          staticResourceTable[relativedPath] = relativedPath
        }
      }
      if ((pwd === lastDirectory || !lastDirectory) && index === files.length - 1) {
        generateJosnFile()
      }
    }
  })
}

const generateJosnFile = () => {
  let fileName = specifiedName + '.json'
  fs.open(path.resolve(specifiedDest, fileName), 'w+', null, (e, fd) => {
    if (e) {
      console.log('create json file err', e)
      return
    }
    fs.write(fd, JSON.stringify(staticResourceTable, null, 2), (error) => {
      error ? console.log('write err', error) : console.log(chalk.green(`add ${fileName} success in ${specifiedDest}`))
      fs.closeSync(fd)
    })
  })
}

module.exports = parseArgs
