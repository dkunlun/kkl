const download = require('download-git-repo')
const path = require('path')

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp')
  return new Promise((resolve, reject) => {
    download('dkunlun/kkl',
      target, { clone: false}, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(target)
        }
      })
  })
}