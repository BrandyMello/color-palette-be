const express = require('express');
const app = express();

app.locals.title = 'color_palette';

app.use(express.json());

app.get('/', (request, response) => {
  response.send('Color Palette');
});

module.exports = app;