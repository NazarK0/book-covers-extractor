const fs = require("fs");
const path = require("path");
const PDFImage = require("pdf-image").PDFImage;
const pngToJpeg = require("png-to-jpeg");

const pdfCover = (filePath, outDir) => {
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

module.exports = pdfCover;
