const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const sharp = require("sharp");
const asyncForEach = require("../helpers/asyncForEach");
const asyncExec = require("../helpers/asyncExec");
const filenameBase = require("../helpers/filenameBase");

const djvuParser = async (files, sourcePath, outDir) => {
  //this module need djvulibre-bin
  if (!shell.which("ddjvu")) {
    console.error('Need to install "djvulibre-bin" first', "Run npm run setup");
  } else {
    console.log("processing djvu files...");

    await asyncForEach(files, async filename => {
      const inFile = path.join(sourcePath, filename);
      const name = filenameBase(filename);
      const outFile = path.join(outDir, `${name}.tiff`);

      asyncExec(`ddjvu -format=tiff -page=1 ${inFile} ${outFile}`).then(() => {
        if (fs.existsSync(outFile)) {
          sharp(outFile)
            .toFile(`${path.join(outDir, name)}.jpeg`)
            .then(() => fs.unlinkSync(outFile))
            .catch(e => console.error(e));
        } else {
          console.error(`${outFile} didn't exist`);
        }
      });
    }).catch(e => console.error(e));

    console.log("djvu files - done.");
  }
};

module.exports = djvuParser;
