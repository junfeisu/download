const inquirer = require('inquirer')
const path = require('path')
const exec = require('child_process').exec
const shell = require('shelljs')
const fs = require('fs')

const options = {
  template: '',
  author: '',
  git: ''
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
    messsage: 'What\'s the template you want to use？'
  }, {
    type: 'input',
    name: 'git',
    message: 'What\'s your project git repository address？'
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
  console.log(process.env.PWD)
}

module.exports = parseArgs
