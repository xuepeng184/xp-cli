const {
  program
} = require("commander")

const path = require('path')


program.version(require('../package.json').version, '-v,--version');

//定义该有的命令
const actionList = [{
  command: 'create',
  alias: 'c',
  description: "创建一个模板",
  from: 'create.js',
  argument: '<project-name>'
}]


//创建命令
for (let item of actionList) {
  let thisAction = require("./commands/create")
  program
    .command(item.command)
    .description(item.description)
    .argument(item.argument)
    .alias(item.alias)
    .action(thisAction)
}


program.parse(process.argv)

if (!program.args.length) {
  program.help
}