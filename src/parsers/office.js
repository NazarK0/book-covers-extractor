const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const exec = require("shelljs.exec");
const pdfParser = require("./pdf");

const officeParser = (sourcePath, outDir) => {
  //this module need libreoffice,
  //and convert all supported by libreoffice formats to pdf
  if (!shell.which("libreoffice")) {
    console.error('Need to install "libreoffice" first', "Run npm run setup");
  } else {
    const tmpDir = path.join(__dirname, "tmp");
    const filename = path.parse(sourcePath).name;
    const pdfFile = path.join(tmpDir, `${filename}.pdf`);

    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const { stderr, code, stdout } = exec(
      `libreoffice --headless --convert-to pdf ${sourcePath} --outdir ${tmpDir}`
    );
    if (stderr) {
      console.log(stderr, code);
    }

    if (fs.existsSync(pdfFile)) {
      pdfParser(pdfFile, outDir);
    } else {
      console.error("pdf file didn`t exist(office converter)");
    }
  }
};

module.exports = officeParser;