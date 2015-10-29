#!/usr/bin/env node

const express = require('express');
const app = express();

app.use('/doc/', express.static('./doc'));
app.use('/', express.static('./web'));
app.listen(3000, function() {
  process.stdout.write('HTTP Server started on port ' + 3000);
});