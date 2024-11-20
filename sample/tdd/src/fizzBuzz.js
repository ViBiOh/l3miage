module.exports = {
  simple: (number) => {
    if (number % 15 === 0) {
      return 'fizzbuzz';
    }
    if (number % 3 === 0) {
      return 'fizz';
    }
    if (number % 5 === 0) {
      return 'buzz';
    }
    return number;
  },
  optimized: (number) =>
    [number, 'fizz', 'buzz', 'fizzbuzz'][3 & (19142723 >> (2 * (number % 15)))],
};
