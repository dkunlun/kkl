const download = require('download-git-repo')
const path = require('path')
const ora = require('ora')

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp')
  console.log(target)
  return new Promise((resolve, reject) => {
    const url = 'dkunlun/kkl'
    const spinner = ora(`正在下载项目模板，源地址：${url}`)
    spinner.start()
    download(url,
      target, { clone: false}, (err) => {
        if (err) {
          spinner.fail()
          reject(err)
        } else {
          spinner.succeed()
          resolve(target)
        }
      })
  })
}