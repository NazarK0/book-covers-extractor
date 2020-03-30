const fs = require("fs");
const path = require("path");
const convert = require("ebook-convert");
const { pdfParserSingle } = require("./pdf");
const shell = require("shelljs");
const asyncForEach = require("../helpers/asyncForEach");
const filenameBase = require("../helpers/filenameBase");

const ebookParser = async (files, sourcePath, outDir) => {
  if (!shell.which("calibre")) {
    console.error('Need to install "calibre" first', "Run npm run setup");
  } else {
    const tmpDir = path.join(__dirname, "../..", "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    
      console.log("processing ebook files...");

      await asyncForEach(files, async filename => {
        const inFile = path.join(sourcePath, filename);
        const name = filenameBase(filename);
        const pdfFile = path.join(tmpDir, `${name}.pdf`);
        const options = {
          input: inFile,
          output: pdfFile,
        };

        convert(options, err => {
          if (err) console.log(err);
          pdfParserSingle(pdfFile, outDir);
        });
      }).catch(e => console.error(e));

      

      console.log("ebook files - done.");
    };

   
  
};

module.exports = ebookParser;
