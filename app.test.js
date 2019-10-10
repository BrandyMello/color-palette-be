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

  describe('POST /api/v1/palettes', () => {
    it('should return a 201 status code when a new palette is added', async () => {
      const palette = await database('palettes').first().select();
      const id = palette.id;

      const mockData = {
      name: 'Autumn',
      projectName: 'Warm Colors',
      colorOne: '#BC8F8F',
      colorTwo: '#A52A2A',
      colorThree: '#FF7D40',
      colorFour: '#CD3700',
      colorFive: '#993300'
    }

    const response = await request(app).post('api/v1/palettes').send(mockData);
    const palettes = await database('palettes').where({id: response.body.id});
    const createdPalette = palettes[0];

    expect(response.status).toBe(201)
    expect(createdPalette.name).toEqual(mockData.name)
    })
  })

  describe('PATCH /api/v1/palettes/:id', () => {
    it('should return a 201 status code and update the palette name', async() => {
      const mockName = {
        name: 'Fall'
      }
      const palette = database.select('palettes').first().select();
      const id = palette.id;
      const response = await request(app).patch('api/v1/palettes/${id}').send(mockName);
      const updated =  await database('palettes').where({id: id});

      expect(response.status).toBe(201);
      expect(updated[0].name).toEqual(mockName.name)
    })
  })

  it('should return a 422 error code if the update of the name was unsuccessful', async() => {
    const mockName = {}
    const palette = database('palettes').first().select();
    const id = palette.id
    const response = request(app).patch(`api/v1/palettes/${id}`).send(mockName);
    expect(response.status).toBe(422)
  })

  describe('DELETE /palettes/:id', () => {
    it('should return a 204 status code and remove palette from database', async () => {
        const palette = await database('palettes').first().select();
        const id = palette.id;
        const response = await request(app).delete(`/api/v1/palettes/${id}`)
        expect(response.status).toBe(204)
    })

    it('should return a 404 if a request id is bad', async () => {
        const response = await request(app).delete('/api/v1/palettes/-1')
        expect(response.status).toBe(404)
    })
})
});

