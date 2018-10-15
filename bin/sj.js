#!/usr/bin/env node

require('babel-register')
const program = require('commander')
const searchItem = require('../utils/array').searchItem

program
  .version(require('../package.json').version)

program
  .command('download')
  .description('download the file with given url')
  .option('-u, --url <string>', '设置需要下载的文件的地址')
  .option('-d, --dest <string>', '设置下载文件存放的地址')
  .option('-n, --file-name <string>', '设置下载文件的文件名')
  .option('-e, --extract-path <string>', '设置zip文件解压路径')
  .action(() => {
    let downloadCom = searchItem(program.commands, {_name: 'download'})
    const parseArg = require('../commands/download')
    parseArg({
      url: downloadCom.url,
      dest: downloadCom.dest ? downloadCom.dest : '',
      name: downloadCom.fileName,
      extract: downloadCom.extractPath
    })
  })

program
  .command('init <projectName>')
  .description('init project similar to the vue-cli init')
  .action((projectName) => {
    const parseArg = require('../commands/init')
    parseArg({
      project: projectName
    })
  })

program
  .command('scan <dir>')
  .description('scan the whole static resource files under dir')
  .option('-r, --relative <string>', '设置需要扫描的项目根目录的相对目录')
  .option('-i, --ignore <string>', '设置需要忽略的目录，默认为相对项目根目录')
  .option('-n, --json-name <string>', '设置生成的json文件名，默认为staticResource.json')
  .option('-d, --dest <string>', '设置生成的json文件的存放位置')
  .action((dir) => {
    let scanItem = searchItem(program.commands, {_name: 'scan'})
    const parseArg = require('../commands/scan')
    parseArg({
      root: dir,
      relative: scanItem.relative,
      ignore: scanItem.ignore,
      name: scanItem.jsonName,
      dest: scanItem.dest ? scanItem.dest : ''
    })
  })

program
  .command('component <name>')
  .description('manage the vue component')
  .option('-p --path <string>', '设置component文件的生成位置')
  .option('-r --router <string>', '设置component的路由路径')
  .option('-d --deprecate', '删除该component')
  .option('-c --css-compiler <string>', '指定css预编译器，默认为无')
  .option('-p --css-public', '当前component css是否公开')
  .action(name => {
    let scanItem = searchItem(program.commands, {_name: 'component'})
    const parseArg = require('../commands/component')

    parseArg({
      name: name,
      filePath: scanItem.path,
      router: scanItem.router,
      deprecate: scanItem.deprecate ? true : false,
      compiler: scanItem.cssCompiler,
      cssPublic: scanItem.cssPublic ? true : false
    })
  })

program.parse(process.argv)

if (!program.args.length) {
  program.help()
}
