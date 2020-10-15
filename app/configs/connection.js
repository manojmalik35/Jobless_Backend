const Sequelize = require("sequelize");
const { DB, USER, PASS, DB_HOST } = require("./config");

const connection = new Sequelize(DB, USER, PASS, {
    host : DB_HOST,
    dialect: 'mysql',
    logging: false
});

connection
    .authenticate()
    .then(async function() {
        console.log('Connection has been established successfully.');
        await connection.sync({alter : true});
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = connection;