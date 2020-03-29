const fs = require("fs");
const path = require("path");
const convert = require("ebook-convert");
const pdfCover = require("./pdfCover");
const shell = require("shelljs");

const ebookCover = (sourceFile, outDir) => {
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
      pdfCover(pdfFile, outDir);
    });
  }
};

module.exports = ebookCover;
