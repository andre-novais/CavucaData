import fs = require('fs');
const stream = fs.createWriteStream('append.txt', { flags: 'a' });

export function create(data) {
  stream.write(JSON.stringify(data) + '\n');
}
