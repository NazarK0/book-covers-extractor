const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const exec = require("shelljs.exec");
const sharp = require("sharp");

const djvuParser = (sourcePath, outDir) => {
  //this module need djvulibre-bin
  if (!shell.which("ddjvu")) {
    console.error('Need to install "djvulibre-bin" first', "Run npm run setup");
  } else {
    const file = path.parse(sourcePath).name;
    const outFile = path.join(outDir, `${file}.tiff`);

    const { stderr, code } = exec(`ddjvu -format=tiff -page=1 ${sourcePath} ${outFile}`);

    if (stderr) {
      console.log(stderr, code);
    }

    if (fs.existsSync(outFile)) {
      sharp(outFile)
        .toFile(`${path.join(outDir, file)}.jpeg`)
        .then(() => fs.unlinkSync(outFile))
        .catch(e => console.error(e));
    } else {
      console.error("tiff file didn`t exist");
    }
  }
};

module.exports = djvuParser;
