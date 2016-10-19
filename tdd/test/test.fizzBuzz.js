const expect = require('chai').expect;
const fizzBuzz = require('../src/fizzBuzz.js');

describe('tdd', () => {
  describe('fizzbuzz', () => {
    it ('should return the same value', () => {
      expect(fizzBuzz(1)).to.be.equal(1);
    });

    it ('should return the second value', () => {
      expect(fizzBuzz(2)).to.be.equal(2);
    });

    it ('should return fizz for 3', () => {
      expect(fizzBuzz(3)).to.be.equal('fizz');
    });

    it ('should return fizz for 6', () => {
      expect(fizzBuzz(6)).to.be.equal('fizz');
    });

    it ('should return fizz for 5', () => {
      expect(fizzBuzz(5)).to.be.equal('buzz');
    });

    it ('should return fizz for 10', () => {
      expect(fizzBuzz(10)).to.be.equal('buzz');
    });

    it ('should return fizzbuzz for 15', () => {
      expect(fizzBuzz(15)).to.be.equal('fizzbuzz');
    });

    it ('should return fizzbuzz for 30', () => {
      expect(fizzBuzz(30)).to.be.equal('fizzbuzz');
    });
  });
});