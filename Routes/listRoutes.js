const express = require('express')

const {
    getRootCategories,
    getSubcategories,
} = require('../Controllers/listController')

const router = express.Router()


router.get('/getRootCategories', getRootCategories)
router.get('/getSubcategories/:parentId', getSubcategories);

module.exports = router
