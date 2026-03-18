const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const RazorpayHistory = sequelize.define('razorpay_history', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    payment_id: {
        type: Sequelize.STRING
    },
    order_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    signature: {
        type: Sequelize.STRING
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = RazorpayHistory;
