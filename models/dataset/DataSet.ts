import fs = require("fs");
var stream = fs.createWriteStream("append.txt", { flags: "a" });

export function create(data) {
  stream.write(JSON.stringify(data) + "\n");
}
