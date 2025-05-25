const express = require('express');
const router = express.Router()
const { searchProduct } = require('../controller/productController');
router.post('/search-products',searchProduct)
module.exports = router