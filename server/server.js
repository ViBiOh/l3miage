#!/usr/bin/env node

"use strict";

const express = require('express');
const app = express();

const SERVER_PORT = 3000;

app.use('/doc/', express.static('./doc'));
app.use('/', express.static('./web'));
app.listen(SERVER_PORT, function() {
  process.stdout.write('Server started on port ' + SERVER_PORT);
});