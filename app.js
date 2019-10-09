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

app.get('/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
  // .catch(error => console.log(error))
});

module.exports = app;