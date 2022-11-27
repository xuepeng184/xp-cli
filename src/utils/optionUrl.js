//处理路径的函数
const optionUrl = (detail, repName) => {
  const front = detail.url.slice(0, -4)
  const urlArray = front.split(repName)
  const result = `${urlArray[0]}:${repName.slice(1)}${urlArray[1]}#${detail.branch}`
  return result
}


module.exports = optionUrl