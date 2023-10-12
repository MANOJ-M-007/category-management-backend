const express = require('express')
const {
    getCategory,
    saveCategory,
    getSubCategory
} = require('../Controllers/categoriesController')

const router = express.Router()

router.get('/getCategories', getCategory)
router.post('/saveCategory', saveCategory)
router.get('/getSubCategory/:categoryId', getSubCategory)

module.exports = router


