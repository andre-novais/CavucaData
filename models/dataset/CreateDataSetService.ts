"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const fs = require("fs");
var stream = fs.createWriteStream("append.txt", { flags: "a" });
function create(data) {
    stream.write(JSON.stringify(data) + "\n");
}
exports.create = create;
