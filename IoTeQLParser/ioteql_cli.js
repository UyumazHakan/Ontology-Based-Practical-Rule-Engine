let parser = require("./ioteql");
let fs = require("fs");

let filename = process.argv[2];

fs.readFile(filename, "utf-8", function(err, data) {
  if (err) throw err;
  console.log(JSON.stringify(parser.parse(data)));
});
