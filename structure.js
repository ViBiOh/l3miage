#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const utils = require("js-utils");

const UTF_8 = "utf-8";

const options = require("yargs")
  .reset()
  .options("docs", {
    alias: "d",
    required: true,
    type: "String",
    describe: "Documents paths"
  })
  .options("json", {
    alias: "j",
    required: true,
    type: "String",
    describe: "mustache.json"
  })
  .options("sitemap", {
    alias: "s",
    required: true,
    type: "String",
    describe: "Sitemap output"
  })
  .options("mustache", {
    alias: "m",
    required: true,
    type: "String",
    describe: "Mustache output"
  })
  .help("help")
  .strict().argv;

const promiseReadFile = utils.asyncifyCallback(fs.readFile);
const promiseWriteFile = utils.asyncifyCallback(fs.writeFile);

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

const requiredPromises = [
  promiseReadFile(options.json, UTF_8).then(c => JSON.parse(c))
];

function readDocs(doc) {
  return new Promise((resolve, reject) => {
    promiseReadFile(doc, UTF_8)
      .then(content =>
        resolve({
          filename: /.*\/(?:[0-9]{2}_)?(.*?)\.md$/.exec(doc)[1],
          content
        })
      )
      .catch(reject);
  });
}
const docsPromise = new Promise((resolve, reject) => {
  glob(options.docs, {}, (error, docs) => {
    handleError(error, reject);

    Promise.all(docs.map(readDocs))
      .then(resolve)
      .catch(reject);
  });
});

requiredPromises.push(docsPromise);

function sitemapConverter(url) {
  return `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.00</priority>
  </url>`;
}

function sitemapStructure(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;
}

new Promise((resolve, reject) => {
  Promise.all(requiredPromises).then(results => {
    const mustache = results[0];

    mustache.docs = results[1].map(doc => ({
      name: doc.filename,
      label: /#?(.*?)$/
        .exec(doc.content.split("\n")[0])[1]
        .replace(/[*]/gim, "")
        .trim()
    }));

    const urls = [
      sitemapConverter(mustache.url),
      ...results[1].map(doc =>
        sitemapConverter(`${mustache.url}/${doc.filename}/`)
      )
    ];

    Promise.all([
      promiseWriteFile(options.mustache, JSON.stringify(mustache, null, 2)),
      promiseWriteFile(options.sitemap, sitemapStructure(urls))
    ])
      .then(() => resolve("Success"))
      .catch(reject);
  });
})
  .then(displaySuccess)
  .catch(displayError);
