const path = require("path");
const fs = require("fs");
const pathNormalizer = require("./helpers/pathNormalizer");
const { pdfParser } = require("./parsers/pdf");
const djvuParser = require("./parsers/djvu");
const officeParser = require("./parsers/office");
const ebookParser = require("./parsers/ebook");

const BookCoversExtractor = (sourceDir, outDir = "./paperbacks") => {
  pathNormalizer.inputDirectory(sourceDir, (err, absoluteSourceDir) => {
    if (err) {
      console.error(err);
      return;
    }

    pathNormalizer.outputDirectory(outDir, (outError, absoluteOutDir) => {
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

                const getCovers = async () => {
                  Promise.all([
                    pdfParser(PDFfiles, absoluteSourceDir, absoluteOutDir),
                    djvuParser(DJVUfiles, absoluteSourceDir, absoluteOutDir),
                    officeParser(OFFICEfiles, absoluteSourceDir, absoluteOutDir),
                    ebookParser(EBOOKfiles, absoluteSourceDir, absoluteOutDir),
                  ]);


                  // if (PDFfiles.length > 0) {
                  //  await pdfParser(PDFfiles, absoluteSourceDir, absoluteOutDir);
                  // }

                  // if (DJVUfiles.length > 0) {
                  //  await djvuParser(DJVUfiles, absoluteSourceDir, absoluteOutDir);
                  // }

                  // if (OFFICEfiles.length > 0) {
                  //  await officeParser(OFFICEfiles, absoluteSourceDir, absoluteOutDir);
                  // }

                  // if (EBOOKfiles.length > 0) {
                  //  await ebookParser(EBOOKfiles, absoluteSourceDir, absoluteOutDir);
                  // }
                };

                getCovers()
              }
            });
          }
        });
      }
    });
  });
};

module.exports = BookCoversExtractor;
