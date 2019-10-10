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
})

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for(let requiredParameter of [
    'name',
    'projectName',
    'colorOne',
    'colorTwo',
    'colorThree',
    'colorFour',
    'colorFive',
    'projectId'
  ]) {
    if(!palette[requiredParameter]) {
      return response.status(422).send({error: 'Unexpected format'})
    }
  }
  database('palettes').insert(palette, 'id')
  .then(palette => {
    return response.status(201).json({id: palette[0]})
})
})

// app.patch("/api/v1/palettes/:id", (req, res) => {
//   if (!req.body.name) {
//     res.status(422).json("Please enter a name");
//   } else {
//     database("palettes")
//       .where("id", req.params.id)
//       .update(req.body)
//       .then(project => {
//         res.status(201).json({ id: project });
//       })
//   }
// });

app.delete("/api/v1/palettes/:id", (req, res) => {
  database("palettes")
    .where("id", req.params.id).del()
    .then(palette => {
      if (!palette) {
        res.status(404).json("No palette found");
      } else {
        res
          .status(204)
          .json(`Palette with id ${req.params.id} has been deleted.`);
      }
    })
});

app.delete('/api/v1/projects/:id', async (request, response) => {
  const project = await database('projects').where('id', request.params.id).select();
  
  if(project.length) {
    await database('palettes').where('projectId', request.params.id).del()
    await database('projects').where('id', request.params.id).del()
    
    response.status(200).json('This project has been deleted.')
  } else {
    return response.status(400).json({ error: 'Delete failed, could not find project with that id.' })
  }
});

module.exports = app;