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

  describe('GET /api/v1/palettes/:id', () => {
    it('should return a 200 status and a single palette if the palette exists', async () => {
      const expectedPalette = await database('palettes').first();
      const id = expectedPalette.id;
      const res = await request(app).get(`/api/v1/palettes/${id}`);
      const result = res.body[0]

      expect(res.status).toBe(200);
      expect(result[0]).toEqual(expectedPalette[0]);
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
    });
    
