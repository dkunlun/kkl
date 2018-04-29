let fs = require('fs')
let path = require('path')
let writeFile = (p, tp) => {
    fs.readdirSync(p).forEach(item => {
        let filePath = path.join(p, item)
        let toFilePath = path.join(tp, item)
        if (!fs.existsSync(toFilePath)) {
            if (!fs.statSync(filePath).isDirectory()) {
                fs.copyFileSync(filePath, toFilePath)
            } else {
                fs.mkdirSync(toFilePath)
                writeFile(filePath, toFilePath)
            }
        } else {
            return false
        }
    })
}

module.exports = {
    writeFile
}