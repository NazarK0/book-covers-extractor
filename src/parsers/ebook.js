const fs = require("fs");
const path = require("path");
const convert = require("ebook-convert");
const { pdfParserSingle } = require("./pdf");
const shell = require("shelljs");
const asyncForEach = require("../helpers/asyncForEach");

const ebookParser = async (files, sourcePath, outDir) => {
  if (!shell.which("calibre")) {
    console.error(
      'Need to install "calibre"',
      "Wait while other files wil be converted and run\napt-get update && apt-get install calibre"
    );
  } else {
    const tmpDir = path.join(__dirname, "../..", "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    await asyncForEach(files, async filename => {
      const inFile = path.join(sourcePath, filename);
      const name = path.parse(filename).name;
      const pdfFile = path.join(tmpDir, `${name}.pdf`);
      const options = {
        input: inFile,
        output: pdfFile,
      };

      convert(options, err => {
        if (err) console.log(err);
        pdfParserSingle(pdfFile, outDir)
          .then(() => {
            fs.unlinkSync(pdfFile);
            const tmpIndex = path.join(sourcePath, "index-1.html");
            if (fs.existsSync(tmpIndex)) {
              fs.unlinkSync(tmpIndex);
            }
          })
          .catch(e => console.error(e));
      });
    }).catch(e => console.error(e));
  }
};

module.exports = ebookParser;
