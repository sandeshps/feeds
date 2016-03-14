'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/feeds-dev'
    // uri : 'mongodb://0.0.0.0:27017/feeds-dev'
  },

  // Seed database on startup
  seedDB: true

};
