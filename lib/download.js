const download = require('download-git-repo')

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp')
  return new Promise(resolve, reject) {
    download('https://github.com:username/templates-repo.git#master',
      target, { clone: true}, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(target)
        }
      })
  }
}