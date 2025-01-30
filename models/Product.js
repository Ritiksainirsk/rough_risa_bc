const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    discount: {
        type: String,
        trim: true
    },
    isOnSale: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: [true, 'Please provide a product category'],
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

module.exports = mongoose.model('Product', productSchema);
