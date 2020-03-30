const fs = require("fs");
const path = require("path");
const PDFImage = require("pdf-image").PDFImage;
const pngToJpeg = require("png-to-jpeg");
const asyncForEach = require("../helpers/asyncForEach");
const filenameBase = require("../helpers/filenameBase");

const pdfParserSingle = (filePath, outDir) => {
  const file = path.parse(filePath).name;
  const pdfImage = new PDFImage(filePath);

  pdfImage
    .convertPage(0)
    .then(out => {
      if (fs.existsSync(out)) {
        let buffer = fs.readFileSync(out);
        pngToJpeg({ quality: 90 })(buffer).then(output =>
          fs.writeFileSync(path.join(outDir, `${file}.jpeg`), output)
        );
      } else {
        console.log("file don`t exist");
      }
    })

    .catch(e => console.log(e));
};

const pdfParser = async (files, sourcePath, outDir) => {

    console.log("processing pdf files...");

    await asyncForEach(files, async filename => {
      const name = filenameBase(filename);
      const inFile = path.join(sourcePath, filename);
      const pdfImage = new PDFImage(inFile);

      pdfImage.convertPage(0).then(out => {
        if (fs.existsSync(out)) {
          let buffer = fs.readFileSync(out);
          pngToJpeg({ quality: 90 })(buffer).then(output =>
            fs.writeFileSync(path.join(outDir, `${name}.jpeg`), output)
          );
        } else {
          console.log(`file ${filename} don't exist`);
        }
      });
    }).catch(e => console.log(e));

    console.log("pdf files - done.");
  };



module.exports = {
  pdfParser,
  pdfParserSingle,
};
