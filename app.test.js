const request = require("supertest");
const app = require("./app");
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

describe("Server", () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe("init", () => {
    it("should return a 200 status code and show a connection to root", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/v1/projects", () => {
    it("should return a 200 status code and all the projects", async () => {
      const expectedProjects = await database("projects").select();
      const res = await request(app).get("/api/v1/projects");
      const projects = res.body;

      expect(res.status).toBe(200);
      expect(projects[0].name).toEqual(expectedProjects[0].name);
    });
  });

  describe("GET /api/v1/projects/:id", () => {
    it("should return a 200 status and a single project if the project exists", async () => {
      const expectedProject = await database("projects").first();
      const id = expectedProject.id;
      const res = await request(app).get(`/api/v1/projects/${id}`);
      const result = res.body[0];

      expect(res.status).toBe(200);
      expect(result[0]).toEqual(expectedProject[0]);
    });
  });

  describe("GET /api/v1/palettes", () => {
    it("should return a 200 status code and all the palettes", async () => {
      const expectedPalettes = await database("palettes").select();
      const res = await request(app).get("/api/v1/palettes");
      const palettes = res.body;

      expect(res.status).toBe(200);
      expect(palettes[0].name).toEqual(expectedPalettes[0].name);
    });
  });

  describe("GET /api/v1/palettes/:id", () => {
    it("should return a 200 status and a single palette if the palette exists", async () => {
      const expectedPalette = await database("palettes").first();
      const id = expectedPalette.id;
      const res = await request(app).get(`/api/v1/palettes/${id}`);
      const result = res.body[0];

      expect(res.status).toBe(200);
      expect(result[0]).toEqual(expectedPalette[0]);
    });
  });

  describe('Post /api/v1/palettes', () => {
    it('should return a 201 status code and add a new project to the database', async () => {
      const paletteData = await database('palettes').select()
      const id = paletteData[0].projectId
      const mockData = {
              name: 'Autumn',
              projectName: 'Warm Colors',
              colorOne: '#BC8F8F',
              colorTwo: '#A52A2A',
              colorThree: '#FF7D40',
              colorFour: '#CD3700',
              colorFive: '#993300',
              projectId: id
            }
      const response = await request(app).post('/api/v1/palettes').send(mockData);
      const palettes = await database('palettes').where({ id: response.body.id });
      const newPalette = palettes[0];

      expect(response.status).toBe(201);
      expect(newPalette.name).toEqual(mockData.name);
    });
  });

  describe("DELETE api/v1/palettes/:id", () => {
    it("should return a 204 status code and remove palette from database", async () => {
      const palette = await database("palettes")
        .first()
        .select();
      const id = palette.id;
      const response = await request(app).delete(`/api/v1/palettes/${id}`);
      expect(response.status).toBe(204);
    });

    it("should return a 404 if a request id is bad", async () => {
      const response = await request(app).delete("/api/v1/palettes/-1");
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should return a 200 and a message', async () => {
      const project = await database('projects').first();
      const id = project.id;

      const res = await request(app).delete(`/api/v1/projects/${id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual('This project has been deleted.')
    });

    it('should return a 400 and an error message', async () => {
     const res = await request(app).delete(`/api/v1/projects/-1`);

      expect(res.status).toBe(400);
      expect(res.body.error).toEqual('Delete failed, could not find project with that id.')
    });
  });
});

  describe('Post /api/v1/projects', () => {
    it('should return a 201 status code and add a new project to the database', async () => {
      const mockProject = {name: 'Summer Time'};
      const response = await request(app).post('/api/v1/projects').send(mockProject);
      const projects = await database('projects').where({ id: response.body.id });
      const newProject = projects[0];

      expect(response.status).toBe(201);
      expect(newProject.name).toEqual(mockProject.name);
    });

    it('should return a 422 status code with an error message "You are missing "parameter here"." if it does not have all of the required parameters', async () => {
      const mockProject = {color: 'green'};
      const response = await request(app).post('/api/v1/projects').send(mockProject);

      expect(response.status).toBe(422);
      expect(response.body.error).toEqual(`Expected format: {
          name: <String>
        }. You are missing a "name".`)
        });
      });

      describe('DELETE /api/v1/projects/:id', () => {

        it('should return a 200 status code and remove the project with the given id from the projects database', async () => {
          const projectId = await database('projects').first('id').then(project => project.id); 
          console.log('projectid', projectId)
          const response = await request(app).delete(`/api/v1/projects/${projectId}`);

          expect(response.status).toBe(200);
        })

        it('should return a 404 if the project is not found', async () => {
         const response = await request(app).delete('/api/v1/projects/-1')
         
         expect(response.status).toBe(400) 
        })
      });

    describe('PATCH /api/v1/projects/:id', () => {
      it('should return a 204 status code and updated the projects name', async () => {
        const updatedName = {
          name: 'Fall'
        }

        const selectedPalette = await database('projects').first();
        const id = selectedPalette.id;

        const response = await request(app).patch(`/api/v1/projects/${id}`).send(updatedName);
        const mockPalette = await database('projects').where('id', id);

        expect(response.status).toBe(202);
        expect(mockPalette[0].name).toEqual(updatedName.name)
      });
    });

      describe('PATCH /api/v1/projects/:id', () => {
        it('should return a 204 status code and updated the projects name', async () => {
          const updatedName = {
            name: 'Fall'
          }
    
          const selectedProject = await database('projects').first();
          const id = selectedProject.id;
    
          const response = await request(app).patch(`/api/v1/projects/${id}`).send(updatedName);
          const mockProject = await database('projects').where('id', id);
    
          expect(response.status).toBe(202);
          expect(mockProject[0].name).toEqual(updatedName.name)
        });
      });

    
