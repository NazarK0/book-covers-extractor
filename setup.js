const fs = require("fs");
const shell = require("shelljs");
const exec = require("shelljs.exec");

if (!fs.existsSync("node_modules")) {
  console.log(
    'installing node modules...',
    "If process don`t start run 'npm i' manually"
  );
  exec("npm i");
} else {
  console.log("✓ node modules installed");
}

if (!shell.which("ddjvu")) {
  console.log(
    'installing "djvulibre-bin"...',
    "If process don`t start run 'apt-get install djvulibre-bin' manually"
  );

  exec("su root && apt-get update && apt-get install djvulibre-bin");
} else {
  console.log("✓ ddjvu installed");
}

if (!shell.which("libreoffice")) {
  console.log(
    'installing "libreoffice"...',
    "If process don`t start run 'apt-get install libreoffice --no-install-recommends' manually"
  );

  exec("su root && apt-get update && apt-get install libreoffice --no-install-recommends");
} else {
  console.log("✓ libreoffice installed");
}

if (!shell.which("calibre")) {
  console.log(
    'installing "calibre"...',
    "If process don`t start run 'apt-get install calibre' manually"
  );

  exec("su root && apt-get update && apt-get install calibre");
} else {
  console.log("✓ calibre installed");
}
