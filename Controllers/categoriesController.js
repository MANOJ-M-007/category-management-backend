const asyncHandler = require('express-async-handler')
const Category = require('../Models/Category')

const getCategory = asyncHandler(async (req, res) => {
    try {
        // Fetch top-level categories (categories without a parent)
        const categories = await Category.find({ parentCategory: null }).populate('subcategories');
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

const saveCategory = asyncHandler(async (req, res) => {
    try {
        const { name, parentCategoryId } = req.body;

        // Find the parent category if provided
        const parentCategory = parentCategoryId ? await Category.findById(parentCategoryId) : null;

        // Create a new category
        const newCategory = new Category({
            name,
            parentCategory: parentCategory ? parentCategory._id : null
        });

        // If parent category exists, add this category to its subcategories
        if (parentCategory) {
            parentCategory.subcategories.push(newCategory);
            await parentCategory.save();
        }

        // Save the new category
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

const getSubCategory = asyncHandler(async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId).populate('subcategories');
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const subcategories = category.subcategories;
        res.status(200).json(subcategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = {
    getCategory,
    saveCategory,
    getSubCategory
}