const inquirer = require('inquirer')
const path = require('path')
const shell = require('shelljs')
const fs = require('fs')
const chalk = require('chalk')
const githubDownloadHost = 'https://codeload.github.com/'
const gitlabDownloadHost = 'https://gitlab.com/'

const options = {
  template: '',
  author: '',
  git: '',
  projectName: '',
  description: ''
}

let projectName = ''

// windows process.env.PWD is undefined
if (!process.env.PWD) {
  process.env.PWD = process.cwd()
}

process.on('exit', () => {
  if (process.cwd() === process.env.PWD) {
    shell.rm('-rf', projectName)
  }
})

const parseArgs = async (args) => {
  const { project } = args
  projectName = project
  if (fs.existsSync(path.resolve(projectName))) {
    const existsResult = await inquirer.prompt([{
      type: 'exists',
      name: 'replaceOrigin',
      message: 'The project ' + projectName + ' has exists.Do you want to replace it?[Y/N]',
      validate: value => {
        if (!value || (value.toUpperCase() !== 'Y' && value.toUpperCase() !== 'N')) {
          console.warn(chalk.yellow('   [slj-warning]: Please enter Y(y) or N(n)'))
        } else {
          return true
        }
      }
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
      let checkGitReg = /(https:\/\/|git@).+\.git$/
      if (templates.indexOf(value) < 0 && !checkGitReg.test(value)) {
        let noneTemplateMes = '   [slj-warning]: Please enter a value in ['
          + templates.join(', ') + '] or a git repo address'
        console.warn(chalk.yellow(noneTemplateMes))
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
        let invalidGitMes = '   [slj-warning]: Please enter a valid git repository address'
        console.warn(chalk.yellow(invalidGitMes))
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

const handleTemplateUrl = (templateUrl) => {
  let isGithub = !!(templateUrl.indexOf('github') >= 0)
  let resolvedUrl = isGithub ? githubDownloadHost : gitlabDownloadHost
  let extractReg = /^(https|git).+(?=\.com[\/|:](.+)\/(.+)\.git$)/
  let userName = ''
  let repoName = ''

  templateUrl.replace(extractReg, (match, $1, $user, $repo) => {
    userName = $user
    repoName = $repo
  })

  if (isGithub) {
    resolvedUrl += userName + '/' + repoName + '/zip/master'
  } else {
    resolvedUrl += userName + '/' + repoName + '/-/archive/master/' + repoName + '-mater.zip'
  }

  return resolvedUrl
}

const downloadTemplates = async () => {
  let gitAdderssReg = /^(https:\/\/|git@).+\.git$/
  if (gitAdderssReg.test(options.template)) {
    let templateUrl = handleTemplateUrl(options.template)
    await shell.exec(`slj download -u ${templateUrl} -e ./`)
    shell.rm('-f', '*.zip')
    let directoryName = shell.ls('./')[0]
    shell.exec(`cp -rT ${directoryName} ./`)
    shell.rm('-rf', directoryName)
    setPackageJson()
  } else {
    let source = path.resolve(__dirname, '../templates/' + options.template + '/')
    shell.exec('cp -rT ' + source + ' ./')
    setPackageJson()
  }
}

const setPackageJson = () => {
  let packageJson = require(path.resolve('./package.json'))
  
  packageJson.author = options.author
  packageJson.repository = {
    type: 'git',
    url: options.git
  }
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
