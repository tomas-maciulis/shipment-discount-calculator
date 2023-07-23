import fs from 'fs'

const getLinesOfDataFromFile = (fileDir: string) => {
  return fs.readFileSync(fileDir, 'utf-8').split('\n')
}

export default getLinesOfDataFromFile