#!/usr/bin/env node

require('babel-register')
const program = require('commander')
const searchItem = require('../utils/array').searchItem

program
  .version(require('../package.json').version)

program
  .command('download')
  .option('-u, --url <string>', '设置需要下载的文件的地址')
  .option('-d, --dest <string>', '设置下载文件存放的地址')
  .option('-n, --file-name <string>', '设置下载文件的文件名')
  .action(() => {
    let downloadCom = searchItem(program.commands, {_name: 'download'})
    const parseArg = require('../commands/download')
    parseArg({
      url: downloadCom.url,
      dest: downloadCom.dest ? downloadCom.dest : '',
      name: downloadCom.fileName
    })
  })

program
  .command('init <projectName>')
  .action((projectName) => {
    const parseArg = require('../commands/init')
    parseArg({
      project: projectName
    })
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
