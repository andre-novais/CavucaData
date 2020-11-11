import fs = require('fs')
const stream = fs.createWriteStream('append.txt', { flags: 'a' })

export function log(data: string): void {
  stream.write(JSON.stringify(data) + '\n')
}
