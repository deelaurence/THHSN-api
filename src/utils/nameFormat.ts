// function isValidNameInput(input) {
//     const namePattern = /^[A-Za-z]+ [A-Za-z]+$/;
//     return namePattern.test(input);
// }


// module.exports = { isValidNameInput }


function isValidNameInput(input: string): boolean {
  const namePattern: RegExp = /^[A-Za-z]+(?:[- ][A-Za-z]+)?$/;

    return namePattern.test(input);
    // return true
  }
  
export { isValidNameInput };
  
