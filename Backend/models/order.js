const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    total_price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
    },
    paymentId: {
        type: Sequelize.STRING
    }
});

module.exports = Order;
