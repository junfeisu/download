#!/usr/bin/env node

const program = require('commander')
const parseArg = require('../commands/download')
const searchItem = require('../utils/array').searchItem

program
  .version(require('../package.json').version)

program
  .command('download')
  .option('-u, --url <string>', '设置需要下载的文件的地址')
  .option('-d, --dest <string>', '设置下载文件存放的地址')
  .action(() => {
    let downloadCom = searchItem(program.commands, {_name: 'download'})
    parseArg({
      url: downloadCom.url,
      dest: downloadCom.dest  
    })
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
