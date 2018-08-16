const nodeVersion = process.versions.node
const chalk = require('chalk')
if (+(nodeVersion.split('.').join('')) < 890) {
  console.log(chalk.red('[sj-warning]: The hapi need node version 8.9+, please update your node'))
  process.exit(0)
}

require('babel-register')
require('./app.js')
