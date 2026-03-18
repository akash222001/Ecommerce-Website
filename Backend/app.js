require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');
const User = require('./models/user');
const Product = require('./models/product');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const Seller = require('./models/seller');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const RazorpayHistory = require('./models/razorpay_history');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/auth');
const sellerAuthRoutes = require('./routes/sellerAuth');
const productRoutes = require('./routes/product');
const purchaseRoutes = require('./routes/purchase');

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(RazorpayHistory);
RazorpayHistory.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });

Seller.hasMany(Product);
Product.belongsTo(Seller);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

app.use('/auth', authRoutes);
app.use('/seller', sellerAuthRoutes);
app.use('/products', productRoutes);
app.use('/purchase', purchaseRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database connected and synced.');
        const PORT = process.env.PORT || 3000;
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use.`);
            } else {
                console.error('Server error:', err);
            }
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });
