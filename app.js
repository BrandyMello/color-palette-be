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

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
    .catch(error => console.log(error));
});

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then(project => {
      if(project.length) {
        return response.status(200).json(project);
      } else {
        return response.status(404).json({
          error: 'No project found.'
        });
      }
    })
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => response.status(200).json(palettes))
    .catch(error => console.log(error));
});

app.get('/api/v1/palettes/:id', (request, response) => {
  database('palettes').where('id', request.params.id).select()
    .then(project => {
      if (project.length) {
        return response.status(200).json(project);
      } else {
        return response.status(404).json({
          error: 'No palette found.'
        });
      }
    })
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if(!project[requiredParameter]) {
      return response
        .status(422)
        .send({
          error: `Expected format: {
          name: <String>
        }. You are missing a "${requiredParameter}".`})
    }
  }
  database('projects').insert(project, 'id')
    .then(project => {
      return response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      return response.status(500).json({error})
    });

    app.delete('/api/v1/projects', (request, response) => {
      database('projects').where('id', request.params.id).del()
        .then(project => {
          if(!project) {
            response.status(404).send('Project not found');
          } else {
            response.status(204).json(`Project with id ${request.params.id} has been deleted from your projects`)
          }
        })
        .catch(error => {
          response.status(500).json({ error });
        });
    });
});

module.exports = app;