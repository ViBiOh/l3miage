const test = require('ava');
const fizzBuzz = require('../src/fizzBuzz.js');

test('should return the first value', (t) => {
  t.is(fizzBuzz(1), 1);
});

test('should return the second value', (t) => {
  t.is(fizzBuzz(2), 2);
});

test('should return fizz for 3', (t) => {
  t.is(fizzBuzz(3), 'fizz');
});

test('should return fizz for 6', (t) => {
  t.is(fizzBuzz(6), 'fizz');
});

test('should return buzz for 5', (t) => {
  t.is(fizzBuzz(5), 'buzz');
});

test('should return buzz for 10', (t) => {
  t.is(fizzBuzz(10), 'buzz');
});

test('should return fizzbuzz for 15', (t) => {
  t.is(fizzBuzz(15), 'fizzbuzz');
});

test('should return fizzbuzz for 30', (t) => {
  t.is(fizzBuzz(30), 'fizzbuzz');
});
