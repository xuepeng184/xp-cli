const {
  program
} = require("commander")


program.version(require('../package.json').version, '-v,--version');

//定义该有的命令
const actionList = [{
  command: 'create',
  alias: 'c',
  description: "根据模板创建项目",
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