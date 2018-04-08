#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob')

program.usage('<project-name>').parse(process.argv)

let projectName = program.args[0]

if(!projectName) {
  program.help()
  return
}

const list = glob.sync('*')
let rootName = path.basename(process.cwd())

if(list.length) {
  if(list.filter(name => {
    const fileName = path.resolve(process.cwd(), path.join('.', name))
    const isDir = fs.statSync(fileName).isDirectory()
    return name.indexOf(projectName) !== -1 && isDir
  }).length !== 0) {
    console.log(`项目${projectName}已经存在`)
    return
  }
  rootName = projectName
} else if (rootName === projectName) {
  rootName = '.'
} else {
  rootName = projectName
}

go()

function go () {
  console.log(path.resolve(process.cwd(), path.join('.', rootName)))
}