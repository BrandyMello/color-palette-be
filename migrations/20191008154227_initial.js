
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('projectName');
      table.string('colorOne');
      table.string('colorTwo');
      table.string('colorThree');
      table.string('colorFour');
      table.string('colorFive');
      table.integer('projectId').unsigned()
      table.foreign('projectId')
      .references('projects.id');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('palettes')
  ])
};
