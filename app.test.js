const request = require('supertest');
const app =  require('./app');
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run()
  });

  describe('init', () => {
    it('should return a 200 status code and show a connection to root', async () =>{
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should return a 200 status code and all the projects', async () => {
      const expectedProjects = await database('projects').select();
      const res = await request(app).get('/api/v1/projects');
      const projects = res.body;

      expect(res.status).toBe(200);
      expect(projects[0].name).toEqual(expectedProjects[0].name);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should return a 200 status and a single project if the project exists', async () => {
      const expectedProject = await database('projects').first();
      const id = expectedProject.id;
      const res = await request(app).get(`/api/v1/projects/${id}`);
      const result = res.body[0]

      expect(res.status).toBe(200);
      expect(result[0]).toEqual(expectedProject[0]);
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should return a 200 status code and all the palettes', async () => {
      const expectedPalettes = await database('palettes').select();
      const res = await request(app).get('/api/v1/palettes');
      const palettes = res.body;

      expect(res.status).toBe(200);
      expect(palettes[0].name).toEqual(expectedPalettes[0].name);
    });
  });
});