const chalk = require('chalk')
//从git仓库下载模板的包
const gitDownload = require('download-git-repo');
const inquirer = require('inquirer');
const fs = require('fs-extra')
const handleBars = require('handlebars')
const optionUrl = require('../utils/optionUrl')
const ora = require('ora')

const template = require('../template.json')

const choices = template.templates.map((item, index) => {
  return {
    value: index,
    name: item.name
  }
})

const create = async (projectName) => {

  //判断是否存在同名的路径
  if (fs.existsSync(projectName)) {
    console.log(chalk.redBright(`\n项目文件夹${projectName}已存在,请更换文件夹名`));
  } else {
    inquirer.prompt([{
        type: 'list',
        name: 'confirmTemplate',
        message: chalk.greenBright('which template do you need?'),
        default: 0,

        choices: choices
      }])
      .then((answers) => {
        const templateDetail = findTemplate(answers.confirmTemplate)
        downloadTemplate(templateDetail, projectName)
      })
      .catch((error) => {
        console.log(error);
      })
  }

}

//寻找路径
const findTemplate = (index) => {
  const result = template.templates[index]
  return result.about
}

//具体的下载逻辑
const downloadTemplate = (detail, projectName) => {
  //处理路径
  const resultUrl = optionUrl(detail, '/xuepeng184')
  const spinner = ora(`Loading the template ...`).start()
  spinner.color = 'magenta'
  let isDownloadSucceed = false
  setTimeout(() => {
    if (!isDownloadSucceed) {
      return spinner.fail(chalk.redBright('下载超时! 请重试或检查网络设置'))
    }
  }, 5000)
  gitDownload(resultUrl, projectName, err => {
    if (err) {
      console.log(err);
      spinner.fail(chalk.redBright('下载失败！'))
      return
    }
    spinner.succeed(chalk.magenta('下载成功！'))
    isDownloadSucceed = true
    inquirer.prompt([{
      type: "input",
      name: 'name',
      message: chalk.greenBright("please enter your project name"),
      validate: function (value) {
        if (value.length) {
          return true
        } else {
          return chalk.greenBright("please enter your project name")
        }
      }
    }]).then((answers) => {
      //这里是替换模板的方式
      const packagePath = `${projectName}/package.json`
      const packageContent = fs.readFileSync(packagePath, 'utf-8')
      //使用handlebars解析模板引擎
      const packageResult = handleBars.compile(packageContent)(answers)
      fs.writeFileSync(packagePath, packageResult)
      console.log(chalk.cyanBright(`\n\n项目创建成功✨✨\n`));
      console.log(chalk.cyanBright(`1. cd ${projectName}\n`));
      console.log(chalk.cyanBright(`2. npm install `));
      console.log(chalk.cyanBright(`\n3. 执行项目启动命令`));
    })
  })
}

module.exports = create