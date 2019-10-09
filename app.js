const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

app.locals.title = 'color_palette';

app.use(express.json());

app.get('/', (request, response) => {
  response.send('Color Palette');
});



module.exports = app;