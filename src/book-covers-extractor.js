const path = require("path");
const fsReaddirRecursive = require("fs-readdir-recursive");
const pathNormalizer = require("./helpers/pathNormalizer");
const { pdfParser } = require("./parsers/pdf");
const djvuParser = require("./parsers/djvu");
const officeParser = require("./parsers/office");
const ebookParser = require("./parsers/ebook");

const BookCoversExtractor = (sourceDir, outDir = "~/paperbacks") => {
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
        let all = fsReaddirRecursive(absoluteSourceDir);

        all.forEach(file => pathNormalizer.fileName(path.join(absoluteSourceDir, file)));
        all = fsReaddirRecursive(absoluteSourceDir);

        const PDFfiles = all.filter(file => file.endsWith(".pdf"));
        const DJVUfiles = all.filter(file => file.endsWith(".djvu"));
        const ebookSupportedFormats = /((azw4)|(chm)|(epub)|(fb2)|(htlz)|(html)|(lit)|(lrf)|(mobi)|(odt)|(pdb)|(pml)|(rb)|(snb)|(tcr)|(txt))$/;
        const EBOOKfiles = all.filter(file => file.match(ebookSupportedFormats));
        const officeSupportedFormats = /((csv)|(docx?)|(xlsx?)|(pptx?)|(dotx)|(vsdx?)|(rtf))$/;
        const OFFICEfiles = all.filter(file => file.match(officeSupportedFormats));

        const getCovers = async () => {
          Promise.all([
            pdfParser(PDFfiles, absoluteSourceDir, absoluteOutDir),
            djvuParser(DJVUfiles, absoluteSourceDir, absoluteOutDir),
            officeParser(OFFICEfiles, absoluteSourceDir, absoluteOutDir),
            ebookParser(EBOOKfiles, absoluteSourceDir, absoluteOutDir),
          ]);
        };

        getCovers();
      }
    });
  });
};

module.exports = BookCoversExtractor;
