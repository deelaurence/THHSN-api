"use strict";
// function isValidNameInput(input) {
//     const namePattern = /^[A-Za-z]+ [A-Za-z]+$/;
//     return namePattern.test(input);
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNameInput = void 0;
// module.exports = { isValidNameInput }
function isValidNameInput(input) {
    const namePattern = /^[A-Za-z]+(?:[- ][A-Za-z]+)?$/;
    return namePattern.test(input);
    // return true
}
exports.isValidNameInput = isValidNameInput;
