const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.route('/')
    .post(upload.array('images', 5), createProduct)
    .get(getProducts);

router.route('/:id')
    .get(getProduct)
    .put(upload.array('images', 5), updateProduct)
    .delete(deleteProduct);

module.exports = router;
