const Cart = require('../models/cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product', 'name imageUrl price originalPrice discount description colors details careInstructions images');

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        res.status(200).json({
            status: 'success',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Add item to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;

        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Find user's cart or create new one
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        // Check if product already exists in cart with same size
        const existingItemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && item.size === size
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                size,
                quantity,
                price: product.price
            });
        }

        await cart.save();
        
        // Populate product details before sending response
        cart = await cart.populate('items.product', 'name imageUrl price originalPrice discount description colors details careInstructions images');

        res.status(200).json({
            status: 'success',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart not found'
            });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({
                status: 'error',
                message: 'Item not found in cart'
            });
        }

        item.quantity = quantity;
        await cart.save();

        res.status(200).json({
            status: 'success',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart not found'
            });
        }

        // Remove the item from cart
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();

        // Populate product details before sending response
        cart = await cart.populate('items.product', 'name imageUrl price originalPrice discount description colors details careInstructions images');

        res.status(200).json({
            status: 'success',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Cart not found'
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            status: 'success',
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
