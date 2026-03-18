const Razorpay = require('razorpay');
const Order = require('../models/order');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.purchaseStorecart = async (req, res, next) => {
    try {
        const user = req.user;

        const cart = await user.getCart();
        const products = await cart.getProducts();

        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty. Cannot checkout.' });
        }

        let totalRupees = 0;
        products.forEach(p => {
            totalRupees += (p.price * p.cartItem.quantity);
        });

        const amountInPaise = totalRupees * 100;

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_user_${user.id}_cart_${cart.id}`,

        });

        const localOrder = await user.createOrder({
            total_price: totalRupees,
            status: 'PENDING',
            paymentId: razorpayOrder.id
        });

        for (let i = 0; i < products.length; i++) {
            await localOrder.addProduct(products[i], {
                through: {
                    quantity: products[i].cartItem.quantity,
                    price: products[i].price
                }
            });
        }

        await user.createRazorpay_history({
            order_id: razorpayOrder.id,
            status: 'PENDING'
        });

        res.status(201).json({
            success: true,
            order: razorpayOrder,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (err) {
        console.error("Razorpay Checkout Error:", err);
        res.status(500).json({ success: false, message: 'Payment gateway initialization failed.' });
    }
};

exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id, status } = req.body;
        const user = req.user;

        const order = await Order.findOne({ where: { paymentId: order_id } });
        const historyLog = await user.getRazorpay_histories({ where: { order_id: order_id } });

        if (!order || historyLog.length === 0) {
            return res.status(404).json({ success: false, message: 'Order or History log not found.' });
        }

        const log = historyLog[0];

        if (status === 'SUCCESS') {
            await order.update({ status: 'SUCCESSFUL' });

            await log.update({
                payment_id: payment_id,
                status: 'SUCCESSFUL'
            });

            const cart = await user.getCart();
            await cart.setProducts(null);

            return res.status(202).json({ success: true, message: 'Payment documented successfully!' });
        } else {
            await order.update({ status: 'FAILED' });

            await log.update({
                payment_id: payment_id || 'Failed',
                status: 'FAILED'
            });

            return res.status(202).json({ success: true, message: 'Payment marked as failed.' });
        }

    } catch (err) {
        console.error("Update Transaction Status Error:", err);
        res.status(500).json({ success: false, message: 'Transaction documentation failed.' });
    }
};
