const chalk = require('chalk')
//从git仓库下载模板的包
const gitDownload = require('download-git-repo');
const inquirer = require('inquirer');
const fs = require('fs-extra')
const handleBars = require('handlebars')

const template = require('../template.json')
console.log(template);


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
      }, {
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
      }])
      .then((answers) => {
        console.log(answers);
        //这里是替换模板的方式
        const packagePath = `${projectName}/package.json`
        const packageContent = fs.readFileSync(packagePath, 'utf-8')
        //使用handlebars解析模板引擎
        const packageResult = handleBars.compile(packageContent)(answers.name)
      })
      .catch((error) => {
        console.log(error);
      })
  }

}

module.exports = create