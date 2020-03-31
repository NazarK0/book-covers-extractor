const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const { pdfParserSingle } = require("./pdf");
const asyncForEach = require("../helpers/asyncForEach");
const asyncExec = require("../helpers/asyncExec");

const officeParser = async (files, sourcePath, outDir) => {
  //this module need libreoffice,
  //and convert all supported by libreoffice formats to pdf
  if (!shell.which("libreoffice")) {
    console.error('Need to install "libreoffice" first', "Run npm run setup");
  } else {
    const tmpDir = path.join(__dirname, "../..", "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    await asyncForEach(files, async filename => {
      const inFile = path.join(sourcePath, filename);
      const name = path.parse(filename).name;
      const pdfFile = path.join(tmpDir, `${name}.pdf`);

      await asyncExec(`libreoffice --headless --convert-to pdf ${inFile} --outdir ${tmpDir}`).then(
        () => {
          if (fs.existsSync(pdfFile)) {
            pdfParserSingle(pdfFile, outDir).then(() => {
              fs.unlinkSync(pdfFile);
            });
          } else {
            console.error(`${pdfFile} didn't exist(office converter)`);
          }
        }
      );
    }).catch(e => console.error(e));
  }
};

module.exports = officeParser;
