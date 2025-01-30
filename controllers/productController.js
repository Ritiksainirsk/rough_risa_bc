const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Helper function to upload to Cloudinary using streams
const streamUpload = async (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'risa-products',
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        
        const readableStream = new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            }
        });
        
        readableStream.pipe(stream);
    });
};

// Helper function to upload multiple files
const uploadMultipleImages = async (files) => {
    const uploadPromises = files.map(file => streamUpload(file.buffer));
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.secure_url);
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            originalPrice,
            discount,
            isOnSale,
            category, 
            stock 
        } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ 
                success: false,
                error: "Name, price and category are required" 
            });
        }

        // Handle multiple images
        let imageUrl = '';
        let images = [];
        
        if (req.files && req.files.length > 0) {
            const uploadedUrls = await uploadMultipleImages(req.files);
            imageUrl = uploadedUrls[0]; // First image as main image
            images = uploadedUrls; // All images in the array
        }

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
            discount,
            isOnSale: isOnSale === 'true',
            category,
            imageUrl,
            images,
            stock: stock ? parseInt(stock) : 0,
            createdAt: new Date()
        });

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get all products or filter by category
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        
        let query = {};
        if (category) {
            query.category = category;
        }
        
        const products = await Product.find(query).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            price, 
            originalPrice,
            discount,
            isOnSale,
            category, 
            stock,
            existingImages
        } = req.body;

        let updateData = {
            name,
            description,
            price: parseFloat(price),
            originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
            discount,
            isOnSale: isOnSale === 'true',
            category,
            stock: stock ? parseInt(stock) : 0
        };

        // Handle image updates
        if (req.files && req.files.length > 0) {
            // If new images are uploaded, use them
            const uploadedUrls = await uploadMultipleImages(req.files);
            updateData.imageUrl = uploadedUrls[0];
            updateData.images = uploadedUrls;
        } else if (existingImages) {
            // If no new images but existing images are provided, keep them
            const existingImageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
            updateData.imageUrl = existingImageUrls[0];
            updateData.images = existingImageUrls;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Product not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};
