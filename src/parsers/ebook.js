const fs = require("fs");
const path = require("path");
const convert = require("ebook-convert");
const pdfParser = require("./pdf");
const shell = require("shelljs");

const ebookParser = (sourceFile, outDir) => {
  if (!shell.which("calibre")) {
    console.error('Need to install "calibre" first', "Run npm run setup");
  } else {
    const tmpDir = path.join(__dirname, "tmp");
    const filename = path.parse(sourceFile).name;
    const pdfFile = path.join(tmpDir, `${filename}.pdf`);
    const options = {
      input: sourceFile,
      output: pdfFile,
    };

    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    convert(options, err => {
      if (err) console.log(err);
      pdfParser(pdfFile, outDir);
    });
  }
};

module.exports = ebookParser;
