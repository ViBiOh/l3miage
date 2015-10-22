'use strict';

let value = process.argv[2];
value.replace(/^([\+\-]?[0-9]+).*/gmi, (global, number) => {
  console.info('Inverse: ' + 1 / parseInt(number, 10));
  process.exit(0);
});
console.error('<' + process.argv[2] + '> is not a valid integer');