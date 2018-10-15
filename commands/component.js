const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

let componentName = ''
let componentPath = ''
let componentRouter = ''
let isDeprecate = false
let cssCompiler = ''
let scoped = ''

if (!process.env.PWD) {
  process.env.PWD = process.cwd()
}

const parseArg = (args) => {
  const { name, filePath, router, deprecate, compiler, cssPublic } = args

  if (!name) {
    console.error(chalk.yellow('[slj-error]:'), chalk.red('component name must be given.'))
    return
  }

  if (!filePath) {
    console.error(chalk.yellow('[slj-error]:'), chalk.red('component file path must be given.'))
    return
  }
  
  componentName = name
  componentPath = path.resolve(process.env.PWD, filePath)
  componentRouter = router ? router : ''
  isDeprecate = deprecate
  scoped = !cssPublic ? 'scoped' : ''
  cssCompiler = compiler ? `lang="${compiler}"` : ''

  generateComponent()
}

const generateComponent = () => {
  if (!fs.existsSync(componentPath)) {
    console.error(chalk.yellow('[slj-error]:'), chalk.red('component will stored path is not exists.'))
    return
  }
  
  const template = `<template>
  <div class="${componentName}"></div>
</template>

<script>
  export default {
    name: "${componentName}"
  }
</script>

<style ${cssCompiler} ${scoped}>
</style>
`

  let componentFilepath = path.resolve(componentPath, componentName + '.vue')

  fs.open(componentFilepath, 'w+', null, (e, fd) => {
    if (e) {
      console.log('create component err', e)
      return
    }
    fs.write(fd, template, error => {
      error ? console.log('write err', error) : console.log(chalk.green(`add ${componentFilepath} success in ${componentPath}`))
      fs.closeSync(fd)
    })
  })

  if (componentRouter) {
    generateRouter()
  }
}

module.exports = parseArg
