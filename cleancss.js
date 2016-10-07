#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mkdirp = require('mkdirp');
const CleanCSS = require('clean-css');
const utils = require('js-utils');

const promiseReadFile = utils.asyncifyCallback(fs.readFile);
const promiseWriteFile = utils.asyncifyCallback(fs.writeFile);
const promiseMkdirP = utils.asyncifyCallback(mkdirp);

const options = require('yargs')
  .reset()
  .options('input', {
    alias: 'i',
    required: true,
    type: 'String',
    describe: 'Output',
  })
  .options('output', {
    alias: 'o',
    required: false,
    type: 'String',
    describe: 'Output',
  })
  .help('help')
  .strict()
  .argv;

const OUTPUT_INDEX_SCHEMA = Math.max(0, options.input.indexOf('*'));

function handleError(error, reject) {
  if (error) {
    reject(error);
  }
}

function displaySuccess(output) {
  console.log(output);
}

function displayError(error) {
  if (error instanceof Error) {
    console.error(error.stack);
  } else {
    console.error(error);
  }
  process.exit(1);
}

function cleanCssPromise(css) {
  return new Promise((resolve, reject) => {
    promiseReadFile(css, 'utf-8')
      .then((cssString) => {
        const rendered = new CleanCSS().minify(cssString).styles;
        if (options.output) {
          const outputFile = path.join(options.output, css.substring(OUTPUT_INDEX_SCHEMA));
          promiseMkdirP(path.dirname(outputFile))
            .then(() => promiseWriteFile(outputFile, rendered).then(() => resolve(outputFile)))
            .catch(reject);
        } else {
          resolve(rendered);
        }
      })
      .catch(reject);
  });
}

new Promise((resolve, reject) => {
  glob(options.input, {}, (error, csss) => {
    handleError(error, reject);

    Promise.all(csss.map(cleanCssPromise))
      .then(values => resolve(values.join('\n')))
      .catch(reject);
  });
}).then(displaySuccess).catch(displayError);
