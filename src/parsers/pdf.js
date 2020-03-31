const fs = require("fs");
const path = require("path");
const PDFImage = require("pdf-image").PDFImage;
const pngToJpeg = require("png-to-jpeg");
const asyncForEach = require("../helpers/asyncForEach");

const pdfParserSingle = async (filePath, outDir) => {
  const file = path.parse(filePath).name;
  const pdfImage = new PDFImage(filePath);

  await pdfImage
    .convertPage(0)
    .then(out => {
      if (fs.existsSync(out)) {
        let buffer = fs.readFileSync(out);
        pngToJpeg({ quality: 90 })(buffer)
          .then(output => {
            fs.writeFileSync(path.join(outDir, `${file}.jpeg`), output);
            return out;
          })
          .then(tmp => {
            if (fs.existsSync(tmp)) {
              fs.unlinkSync(tmp);
            }
          });
      } else {
        console.log(`file ${filePath} don't exist`);
      }
    })
    .catch(e => console.log(e));
};

const pdfParser = async (files, sourcePath, outDir) => {
  await asyncForEach(files, async filename => {
    pdfParserSingle(path.join(sourcePath, filename), outDir);
  }).catch(e => console.log(e));
};

module.exports = {
  pdfParser,
  pdfParserSingle,
};
