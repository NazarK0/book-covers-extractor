const path = require("path");
const fs = require("fs");
const pathNormalizer = require("./pathNormalizer");
const pdfCover = require("./pdfCover");
const djvuCover = require("./djvuCover");
const officeCover = require("./officeCover");
const ebookCover = require("./ebookCover");

const getCover = (sourceDir, outDir = "./paperbacks") => {
  pathNormalizer.InputDirectory(sourceDir, (err, absoluteSourceDir) => {
    if (err) {
      console.error(err);
      return;
    }

    pathNormalizer.OutputDirectory(outDir, (outError, absoluteOutDir) => {
      if (outError) {
        console.error(outError);
        return;
      }

      if (absoluteSourceDir !== null) {
        fs.readdir(absoluteSourceDir, (err, all) => {
          if (err) {
            console.error(err);
          } else {
            all.forEach(file => pathNormalizer.fileName(path.join(absoluteSourceDir, file)));

            fs.readdir(absoluteSourceDir, (errNormalized, allNormalized) => {
              if (err) {
                console.error(errNormalized, "normalized files");
              } else {
                const PDFfiles = allNormalized.filter(file => file.endsWith(".pdf"));
                const DJVUfiles = allNormalized.filter(file => file.endsWith(".djvu"));
                const ebookSupportedFormats = /((azw4)|(chm)|(epub)|(fb2)|(htlz)|(html)|(lit)|(lrf)|(mobi)|(odt)|(pdb)|(pml)|(rb)|(snb)|(tcr)|(txt))$/;
                const EBOOKfiles = allNormalized.filter(file => file.match(ebookSupportedFormats));
                const officeSupportedFormats = /((csv)|(docx?)|(xlsx?)|(pptx?)|(dotx)|(vsdx?)|(rtf))$/;
                const OFFICEfiles = allNormalized.filter(file =>
                  file.match(officeSupportedFormats)
                );

                console.log('processing...');

                if (PDFfiles.length > 0) {
                  PDFfiles.forEach(file =>
                    pdfCover(path.join(absoluteSourceDir, file), absoluteOutDir)
                  );
                }

                if (DJVUfiles.length > 0) {
                  DJVUfiles.forEach(file =>
                    djvuCover(path.join(absoluteSourceDir, file), absoluteOutDir)
                  );
                }

                if (OFFICEfiles.length > 0) {
                  OFFICEfiles.forEach(file =>
                    officeCover(path.join(absoluteSourceDir, file), absoluteOutDir)
                  );
                }

                if (EBOOKfiles.length > 0) {
                  EBOOKfiles.forEach(file =>
                    ebookCover(path.join(absoluteSourceDir, file), absoluteOutDir)
                  );
                }
              }
            });
          }
        });
      }
    });
  });
};

module.exports = getCover;