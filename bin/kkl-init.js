#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const download = require('../lib/download')
const inquirer = require('inquirer')
const generator = require('../lib/generator')

program.usage('<project-name>').parse(process.argv)

let projectName = program.args[0]

if(!projectName) {
  program.help()
  return
}

const list = glob.sync('*')
let rootName = path.basename(process.cwd())

let next = null
if(list.length) {
  if(fs.existsSync(projectName)) {
    console.log(`项目${projectName}已经存在`)
    return
  }
  next = Promise.resolve(projectName)
} else if (rootName === projectName) {
  next = inquirer.prompt([
    {
      name: 'buildInCurrent',
      message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
      type: 'confirm',
      default: true
    }
  ]).then(answer => {
    return Promise.resolve(answer.buildInCurrent ? '.' : projectName)
  })
} else {
  next = Promise.resolve(projectName)
}

next && go()

function go () {
  next.then(projectRoot => {
    if(projectRoot !== '.') {
      fs.mkdirSync(projectRoot)
    }
    return download(projectRoot).then(target => {
      return {
        projectRoot,
        root: projectRoot,
        downloadTemp: target
      }
    }).then(context => {
      return inquirer.prompt([
        {
          name: 'projectName',
          message: '项目的名称',
          default: context.name
        }, {
          name: 'projectVersion',
          message: '项目的版本号',
          default: '1.0.0'
        }, {
          name: 'projectDescription',
          message: '项目的简介',
          default: `A project named ${context.name}`
        }
      ]).then(answers => {
        return {
          ...context,
          metadata: {
            ...answers
          }
        }
      }).then(context => {
        // 添加生成的逻辑
        return generator(context)
      }).then(context => {
        console.log('创建成功:)')
      }).catch(err => {
        console.error(`创建失败：${err.message}`)
      }) 
    })
  })
}