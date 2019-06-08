import * as path from 'path'
import { homedir } from 'os'
import * as fs from 'fs'

const filename = path.resolve(`${homedir}/.my.cnf.clients`)
const myCnfFile = path.resolve(`${homedir}/.my.cnf`)

const DEFAULT_ENVIRONMENT = 'default'

interface Options {
  environment: string
}

export function myCnfManager(
  options: Options = {
    environment: DEFAULT_ENVIRONMENT
  }
) {
  const { environment } = options

  let environmentFound = false
  let collectLines = false
  let lines = ['[client]', '']
  let values: any = {}
  let usingDefaultEnvironment = environment === DEFAULT_ENVIRONMENT

  fs.readFileSync(filename)
    .toString()
    .split('\n')
    .forEach(line => {
      let matches = line.match(/\[(.+?)\]/)

      if (matches && matches[1]) {
        collectLines = [environment, DEFAULT_ENVIRONMENT].includes(matches[1])
        if (
          collectLines &&
          !environmentFound &&
          matches[1] !== DEFAULT_ENVIRONMENT
        ) {
          environmentFound = true
        }
      }

      if (collectLines && matches === null) {
        let [key, value] = line.split('=')
        values[key] = value || ''
      }
    })

  let myCnfFileContent =
    [
      ...lines,
      ...Object.keys(values)
        .filter(key => key)
        .map(key => `${key}=${values[key]}`)
    ].join('\n') + '\n'

  if (environmentFound || usingDefaultEnvironment) {
    fs.writeFileSync(myCnfFile, myCnfFileContent)
    console.log(`switched .my.cnf to ${environment}`)
  } else {
    console.error(`environment ${environment} not found`)
    process.exit(1)
  }
}
