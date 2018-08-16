const inquirer = require('inquirer')
const path = require('path')
const shell = require('shelljs')
const fs = require('fs')
const chalk = require('chalk')

const options = {
  template: '',
  author: '',
  git: '',
  projectName: '',
  description: ''
}

let projectName = ''

const parseArgs = async (args) => {
  const { project } = args
  projectName = project
  if (fs.existsSync(path.resolve(projectName))) {
    const existsResult = await inquirer.prompt([{
      type: 'exists',
      name: 'replaceOrigin',
      message: 'The project ' + projectName + ' has exists.Do you want to replace it?[Y/N]'
    }])

    if (existsResult.replaceOrigin.toUpperCase() !== 'Y') {
      process.exit(1)
    }
    shell.rm('-rf', projectName)
  }
  fs.mkdirSync(projectName)

  getUserOptions()
}

const getUserOptions = async () => {
  const questions = [{
    type: 'input',
    name: 'template',
    messsage: 'What\'s the template you want to use？',
    validate: (value) => {
      const templates = ['server']
      if (templates.indexOf(value) < 0) {
        console.warn(chalk.yellow('   [sj-warning]: Please enter a value in [' + templates.join(', ') + ']'))
      } else {
        return true
      }
    }
  }, {
    type: 'input',
    name: 'projectName',
    message: `What\'s your project name?[${projectName}]?`,
    default: () => projectName
  }, {
    type: 'input',
    name: 'description',
    message: 'What\'s your project description?'
  }, {
    type: 'input',
    name: 'git',
    message: 'What\'s your project git repository address？',
    validate: (value) => {
      let checkGitReg = /(https:\/\/|git@).+\.git$/
      if (!checkGitReg.test(value)) {
        console.warn(chalk.yellow('   [sj-warning]: Please enter a valid git repository address'))
      } else {
        return true
      }
    }
  }, {
    type: 'input',
    name: 'author',
    message: 'The author of this project？'
  }]

  const questionResult = await inquirer.prompt(questions)
  for (let option in questionResult) {
    options[option] = questionResult[option]
  }

  setOptions()
}

const setOptions = () => {
  if (!shell.which('git')) {
    shell.echo('Sorry, you should install git first.')
    shell.exit(1)
  }
  shell.cd(projectName)
  shell.exec('git init')
  shell.exec('git remote add origin ' + options.git)
  downloadTemplates()
}

const downloadTemplates = () => {
  let source = path.resolve(__dirname, '../templates/' + options.template + '/')
  shell.exec('cp -rT ' + source + ' ./')
  setPackageJson()
}

const setPackageJson = () => {
  let packageJson = require(path.resolve('./package.json'))
  
  packageJson.author = options.author
  packageJson.repository.url = options.git
  packageJson.description = options.description
  packageJson.name = options.projectName
  fs.writeFileSync(path.resolve('./package.json'), JSON.stringify(packageJson, null, 2))
  downloadNodeModules()
}

const downloadNodeModules = () => {
  shell.exec('npm i', (code, stdout, stderr) => {
    console.log(chalk.green('The project is create successfully.'))
  })
}

module.exports = parseArgs
