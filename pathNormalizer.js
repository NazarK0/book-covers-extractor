const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

const normalizeIfHomePath = sourceDir => {
  return sourceDir.startsWith("~") ? path.join(homedir, sourceDir.substring(1)) : sourceDir;
};

const InputDirectory = (dirPath, callback) => {
  const normalized = normalizeIfHomePath(dirPath);

  fs.access(normalized, err => {
    if (err) {
      callback("input directory didn`t exist", null);
    } else {
      if (path.isAbsolute(normalized)) {
        callback(null, normalized);
      } else {
        callback(null, path.resolve(normalized));
      }
    }
  });
};

const OutputDirectory = (dirPath, callback) => {
  const normalized = normalizeIfHomePath(dirPath);

  fs.access(normalized, err => {
    if (err) {
      fs.mkdir(normalized, { recursive: true }, e => {
        if (e) {
          callback("Can`t create output dir", null);
        } else {
          console.log("Output directory created");
          callback(null, normalized);
        }
      });
    } else {
      if (path.isAbsolute(normalized)) {
        callback(null, normalized);
      } else {
        callback(null, path.resolve(normalized));
      }
    }
  });
};

const fileName = filePath => {
  const sourceName = path.parse(filePath).name;
  const sourceDir = path.parse(filePath).dir;
  const sourceExt = path.parse(filePath).ext;
  const editedName = sourceName.replace(/[\s(),;:#]/g, "");

  if (editedName !== sourceName) {
    fs.renameSync(filePath, path.join(sourceDir, `${editedName}${sourceExt}`));
    console.log(`File ${sourceName} renamed to ${editedName} for shell compabillity.`);
  }
};

module.exports = {
  InputDirectory,
  OutputDirectory,
  fileName,
};
