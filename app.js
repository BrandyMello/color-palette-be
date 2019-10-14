const express = require("express");
const app = express();
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const cors = require("cors");

app.locals.title = "color_palette";

app.use(express.json());

app.use(cors());

app.get("/", (request, response) => {
  response.send("Color Palette");
});

app.get("/api/v1/projects", (request, response) => {
  database("projects")
    .select()
    .then(projects => response.status(200).json(projects))
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get("/api/v1/projects/:id", (request, response) => {
  database("projects")
    .where("id", request.params.id)
    .select()
    .then(project => {
      if (project.length) {
        return response.status(200).json(project);
      } else {
        return response.status(404).json({
          error: "No project found."
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get("/api/v1/palettes", (request, response) => {
  database("palettes")
    .select()
    .then(palettes => response.status(200).json(palettes))
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get("/api/v1/projects/:id/palettes", (request, response) => {
  database("palettes")
    .where("projectId", request.params.id)
    .select()
    .then(palettes => {
      if (!palettes.length) {
        return response.status(404).json({
          error: "No palette found."
        });
      } else {
        return response.status(200).json(palettes);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get("/api/v1/search", (request, response) => {
  const query = request.query.name;

  database("projects")
    .where("name", query)
    .select()
    .then(project => {
      if (!project) {
        return response.status(404).json("Project not found");
      } else {
        return response.status(200).json(project);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

 app.post("/api/v1/projects", (request, response) => {
  const project = request.body;

  for (let requiredParameter of ["name"]) {
    if (!project[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: {
          name: <String>
        }. You are missing a "${requiredParameter}".`
      });
    }
  }
  database("projects")
    .insert(project, "id")
    .then(project => {
      return response.status(201).json({ id: project[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.post("/api/v1/palettes", (request, response) => {
  const palette = request.body;

  for (let requiredParameter of [
    "name",
    "projectName",
    "colorOne",
    "colorTwo",
    "colorThree",
    "colorFour",
    "colorFive",
    "projectId"
  ]) {
    if (!palette[requiredParameter]) {
      return response.status(422).send({ error: "Unexpected format" });
    }
  }
  database("palettes")
    .insert(palette, "id")
    .then(palette => {
      return response.status(201).json({ id: palette[0] });
    });
});

app.patch("/api/v1/projects/:id", async (request, response) => {
  const newProjectName = request.body;
  const project = await database("projects")
    .where("id", request.params.id)
    .select();

  if (project.length) {
    await database("projects")
      .where("id", request.params.id)
      .update(newProjectName);
    return response.status(202).json({ id: request.params.id });
  } else {
    return response.status(400).json({
      error: `Could not find project with id of ${request.params.id}`
    });
  }
});

app.patch("/api/v1/palettes/:id", async (request, response) => {
  const newPaletteName = request.body;
  const palette = await database("palettes")
    .where("id", request.params.id)
    .select();

  if (palette.length) {
    await database("palettes")
      .where("id", request.params.id)
      .update(newPaletteName);
    return response.status(202).json({ id: request.params.id });
  } else {
    return response.status(400).json({
      error: `Could not find palette with id of ${request.params.id}`
    });
  }
});

app.delete("/api/v1/projects/:id", async (request, response) => {
  const project = await database("projects")
    .where("id", request.params.id)
    .select();

  if (project.length) {
    await database("palettes")
      .where("projectId", request.params.id)
      .del();
    await database("projects")
      .where("id", request.params.id)
      .del();

    response.status(200).json(`The project with the id ${request.params.id} has been deleted.`);
  } else {
    return response
      .status(400)
      .json({ error: "Delete failed, could not find project with that id." });
  }
});

app.delete("/api/v1/palettes/:id", (request, response) => {
  database("palettes")
    .where("id", request.params.id)
    .del()
    .then(palette => {
      if (!palette) {
        response.status(404).json("No palette found");
      } else {
        response
          .status(204)
          .json(`Palette with id ${request.params.id} has been deleted.`);
      }
    });
});

module.exports = app;
