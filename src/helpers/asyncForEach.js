/**
 * Executes a ForEach command asynchronously.
 * @param array {array or pseudo-array type}
 * @param callback {callback function}
 */

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = asyncForEach;
