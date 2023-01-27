const fs = require('fs').promises
const p = require('path')
const { EmptyFileError } = require('../errors/file-import')

const importFile = async (path) => {
  const file = await fs.readFile(path, ('utf-8'))
  const objArr = await parseFile(file)
  await fs.unlink(path);
  return objArr
}

const parseFile = async (file) => {
  const arr = file.split('\n').filter(x => x.length > 0);
  if (arr.length < 1) {
    throw new EmptyFileError('')
  }
  let returnArr = [];
  for (var i = 0; i < arr.length; i += 4) {
    const chunk = arr.slice(i, i + 4)
    const movie = chunk.reduce((acc, rec, ind) => {
      let splitted = rec.split(': ')
      if (splitted[0].toLowerCase() === 'release year') {
        splitted[0] = 'year'
        splitted[1] = Number.parseInt(splitted[1])
      }
      if (splitted[0].toLowerCase() === 'stars') {
        splitted[0] = 'actors'
        splitted[1] = splitted[1].split(', ').map(x => { return { name: x } })
      }
      return {
        ...acc,
        [splitted[0].toLowerCase()]: splitted[1]
      }
    }, {})
    returnArr = [...returnArr, movie]
  }
  return returnArr
}
module.exports = importFile