const Sequelize = require("sequelize");
const { DB, USER, PASS } = require("../configs/config");

const connection = new Sequelize(DB, USER, PASS, {
    dialect: 'mysql',
    logging: false
});

connection
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = connection;