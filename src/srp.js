'use strict';

class IntegerConverter {
  fromString(str) {
    if (str.search(/^[\+\-]?[0-9]+$/) !== -1) {
      return parseInt(str, 10);
    }
    throw new Error('<' + str + '> is not a valid integer');
  }
}

class InverseProcess {
  do(intValue) {
    return 1 / intValue;
  }
}

class ScreenWriter {
  info(value) {
    console.info(value);
  }

  error(value) {
    console.error(value);
  }
}

const converter = new IntegerConverter();
const inverse = new InverseProcess();
const display = new ScreenWriter();

try {
  display.info('Inverse: ' + inverse.do(converter.fromString(process.argv[2])));
} catch (err) {
  display.error(err.message);
}
