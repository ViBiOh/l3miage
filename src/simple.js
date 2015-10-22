'use strict';

const value = process.argv[2];
value.replace(/^([\+\-]?[0-9]+)$/, number => {
  console.info('Inverse: ' + 1 / parseInt(number, 10));
  process.exit(0);
});
console.error('<' + value + '> is not a valid integer');
