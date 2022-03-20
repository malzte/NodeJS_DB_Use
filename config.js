//Setting up our databse connection
const Sequelize = require('sequelize');
const config = new Sequelize("school", "teo", "password", {dialect:'mysql'});

module.exports = config;