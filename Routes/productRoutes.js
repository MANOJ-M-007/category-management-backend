const express = require('express')
const { saveProduct } = require('../Controllers/productController')

const router = express.Router()

router.post('/saveProduct', saveProduct)

module.exports = router


