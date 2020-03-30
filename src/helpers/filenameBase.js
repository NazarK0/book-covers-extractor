/**
 * Return base part from filename ( without extention )
 * @param filename {string}
 */

const filenameBase = filename => filename.replace(/\.[^/.]+$/, "");

module.exports = filenameBase;