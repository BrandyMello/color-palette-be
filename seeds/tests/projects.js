const data = require('../../color_data');

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name
  }, 'id')
    .then(projectId => {
      let promisesPalette = [];

      project.palettes.forEach(palette => {
        promisesPalette.push(
          createPalette(knex, {
            name: palette.name,
            projectName: palette.projectName,
            colorOne: palette.colorOne,
            colorTwo: palette.colorTwo,
            colorThree: palette.colorThree,
            colorFour: palette.colorFour,
            colorFive: palette.colorFive,
            projectId: projectId[0]
          })
        )
      })

      return Promise.all(promisesPalette);
    })
}

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
}

exports.seed = knex => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let promisesProject = [];

      data.forEach(project => {
        promisesProject.push(createProject(knex, project))
      })
      return Promise.all(promisesProject)
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
}

