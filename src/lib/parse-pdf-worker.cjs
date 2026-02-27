const fs = require("fs");
const pdfParse = require("pdf-parse");
const filePath = process.argv[2];

if (!filePath) {
  process.stderr.write("No file path provided\n");
  process.exit(1);
}

const buf = fs.readFileSync(filePath);
pdfParse(buf)
  .then((data) => {
    process.stdout.write(data.text || "");
  })
  .catch((err) => {
    process.stderr.write("Parse error: " + err.message + "\n");
    process.stdout.write("");
  });
