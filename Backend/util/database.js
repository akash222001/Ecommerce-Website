const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    logging: false
});

module.exports = sequelize;
