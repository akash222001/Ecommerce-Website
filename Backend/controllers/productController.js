const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({ success: true, products: products });
    } catch (err) {
        console.error('Fetch Products Error: ', err);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
};

exports.postAddProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock_quantity, image_url } = req.body;
        const seller = req.seller;
        
        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Product name and price are required.' });
        }

        const newProduct = await seller.createProduct({
            name: name,
            description: description || '',
            price: price,
            stock_quantity: stock_quantity || 1,
            image_url: image_url || ''
        });
        
        res.status(201).json({ success: true, message: 'Product added successfully!', product: newProduct });
    } catch (err) {
        console.error('Add Product Error: ', err);
        res.status(500).json({ success: false, message: 'Failed to create product. Make sure you are an authorized seller.' });
    }
};

exports.getSellerProducts = async (req, res, next) => {
    try {
        const seller = req.seller;
        const products = await seller.getProducts();
        
        res.status(200).json({ success: true, products: products });
    } catch (err) {
        console.error('Fetch Seller Products Error: ', err);
        res.status(500).json({ success: false, message: 'Failed to fetch your inventory.' });
    }
}

exports.getCart = async (req, res, next) => {
    try {
        let cart = await req.user.getCart();
        if(!cart) {
            cart = await req.user.createCart();
        }
        
        const products = await cart.getProducts();
        res.status(200).json({ success: true, cartItems: products });
        
    } catch (err) {
        console.error("Fetch Cart Error: ", err);
        res.status(500).json({ success: false, message: 'Failed to load user cart' });
    }
};

exports.postCart = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        
        let cart = await req.user.getCart();
        if(!cart) {
            cart = await req.user.createCart();
        }
        
        const products = await cart.getProducts({ where: { id: productId } });
        let product;
        if (products.length > 0) {
            product = products[0];
        }

        let newQuantity = 1;
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            await cart.addProduct(product, { through: { quantity: newQuantity }});
            return res.status(200).json({ success: true, message: 'Increased quantity in cart' });
        } else {
            product = await Product.findByPk(productId);
            if(!product) return res.status(404).json({ success: false, message: 'Product not found!'});
            
            await cart.addProduct(product, { through: { quantity: newQuantity }});
            return res.status(201).json({ success: true, message: 'Product added to cart' });
        }

    } catch (err) {
        console.error("Add to Cart Error: ", err);
        res.status(500).json({ success: false, message: 'Failed to add item to cart' });
    }
}
