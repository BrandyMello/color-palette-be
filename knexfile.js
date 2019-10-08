// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/color_be'
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/color_be_test'
  }
};
