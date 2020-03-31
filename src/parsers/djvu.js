const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const sharp = require("sharp");
const asyncForEach = require("../helpers/asyncForEach");
const asyncExec = require("../helpers/asyncExec");

const djvuParser = async (files, sourcePath, outDir) => {
  //this module need djvulibre-bin
  if (!shell.which("ddjvu")) {
    console.error(
      'Need to install "djvulibre-bin"',
      "Wait while other files will be converted and run\napt-get update && apt-get install djvulibre-bin"
    );
  } else {
    await asyncForEach(files, async filename => {
      const inFile = path.join(sourcePath, filename);
      const name = path.parse(filename).name;
      const outFile = path.join(outDir, `${name}.tiff`);

      asyncExec(`ddjvu -format=tiff -page=1 ${inFile} ${outFile}`).then(() => {
        if (fs.existsSync(outFile)) {
          sharp(outFile)
            .toFile(`${path.join(outDir, name)}.jpeg`)
            .then(() => {
              if (fs.existsSync(outFile)) {
                fs.unlinkSync(outFile);
              }
            })
            .catch(e => console.error(e));
        } else {
          console.error(`${outFile} didn't exist`);
        }
      });
    }).catch(e => console.error(e));
  }
};

module.exports = djvuParser;
