const fs = require("fs");
const path = require("path");
const homedir = require("os").homedir();

const normalizeIfHomePath = sourceDir => {
  return sourceDir.startsWith("~") ? path.join(homedir, sourceDir.substring(1)) : sourceDir;
};

const inputDirectory = dirPath => {
  const normalized = normalizeIfHomePath(dirPath);

  if (fs.existsSync(normalized)) {
    if (path.isAbsolute(normalized)) {
      return normalized;
    } else {
      return path.resolve(normalized);
    }
  } else {
    console.log("input directory didn`t exist");
    return null;
  }
};

const outputDirectory = dirPath => {
  const normalized = normalizeIfHomePath(dirPath);

  if (fs.existsSync(normalized)) {
    if (path.isAbsolute(normalized)) {
      return normalized;
    } else {
      return path.resolve(normalized);
    }
  } else {
    try {
      fs.mkdirSync(normalized, { recursive: true });
      return normalized;
    } catch (e) {
      console.log("Can`t create output dir", e);
      return null;
    }
  }
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
  inputDirectory,
  outputDirectory,
  fileName,
};
