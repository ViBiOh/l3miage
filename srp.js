'use strict';

class IntegerReader {
  constructor() {
    this.regexInteger = /^([\+\-]?[0-9]+).*/gmi;
  }

  getInt(chunk) {
    return new Promise((resolve, reject) => {
      if (chunk !== null) {
        chunk.replace(this.regexInteger, (global, number) => {
          resolve(parseInt(number, 10));
        });
        reject('<' + chunk.replace(/\w?\n$/gmi, '') + ' > is not an integer');
      }
    });
  }

  read() {
    return new Promise((resolve, reject) => {
      try {
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', () => {
          this.getInt(process.stdin.read())
            .then(intValue => resolve(intValue), err => reject(err));
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

var keyboard = new IntegerReader();
keyboard.read().then(value => {
  console.log(value);
  process.exit();
}, err => console.error(err));