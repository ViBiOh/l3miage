process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    chunk.replace(/^([\+\-]?[0-9]+).*/gmi, (global, number) => {
      console.info('Inverse : ' + 1 / parseInt(number, 10));
      process.exit(0);
    });
    console.error('<' + chunk.replace(/\n/gmi, '') + ' > is not a valid integer');
  }
});

process.stdin.on('end', () => {
  process.stdout.write('end');
});