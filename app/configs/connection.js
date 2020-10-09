const Sequelize = require("sequelize");
const { DB, USER, PASS } = require("./config");

const connection = new Sequelize(DB, USER, PASS, {
    dialect: 'mysql',
    logging: false
});

connection
    .authenticate()
    .then(async function() {
        console.log('Connection has been established successfully.');
        await connection.sync();
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = connection;