
const asyncHandler = require('express-async-handler');
const Category = require('../Models/Category');
const Product = require('../Models/Product');

const getRootCategories = asyncHandler(async (req, res) => {
    try {
        const rootCategories = await Category.find({ parentCategory: null }).lean();
        const categoriesWithProducts = await Promise.all(
            rootCategories.map(async (rootCategory) => {
                const products = await Product.find({
                    $or: [
                        { category: rootCategory._id }, // Products directly under the category
                        { ancestors: rootCategory._id }, // Products under any ancestor category
                    ],
                }).lean();

                const subcategories = await Category.find({ parentCategory: rootCategory._id }).lean();

                const subcategoriesWithProductCount = await Promise.all(
                    subcategories.map(async (subcategory) => {
                        const subcategoryProducts = await Product.find({
                            $or: [
                                { category: subcategory._id }, // Products directly under the subcategory
                                { ancestors: subcategory._id }, // Products under any ancestor subcategory
                            ],
                        }).lean();

                        return {
                            _id: subcategory._id,
                            name: subcategory.name,
                            numberOfProducts: subcategoryProducts.length,
                        };
                    })
                );

                return {
                    _id: rootCategory._id,
                    name: rootCategory.name,
                    products: products,
                    subcategories: subcategoriesWithProductCount,
                    numberOfProducts: products.length,
                };
            })
        );

        res.json(categoriesWithProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const getSubcategories = asyncHandler(async (req, res) => {
    try {
        const parentId = req.params.parentId;
        const immediateSubcategories = await Category.find({ _id: parentId }).lean();

        const subcategoriesWithProducts = await Promise.all(
            immediateSubcategories.map(async (subCategory) => {
                const products = await Product.find({
                    $or: [
                        { category: subCategory._id }, // Products directly under the subcategory
                        { ancestors: subCategory._id }, // Products under any ancestor subcategory
                    ],
                }).lean();

                const subcategories = await Category.find({ parentCategory: subCategory._id }).lean();

                const subcategoriesWithProductCount = await Promise.all(
                    subcategories.map(async (subcategory) => {
                        const subcategoryProducts = await Product.find({
                            $or: [
                                { category: subcategory._id }, // Products directly under the sub-subcategory
                                { ancestors: subcategory._id }, // Products under any ancestor sub-subcategory
                            ],
                        }).lean();

                        return {
                            _id: subcategory._id,
                            name: subcategory.name,
                            numberOfProducts: subcategoryProducts.length,
                        };
                    })
                );

                return {
                    _id: subCategory._id,
                    name: subCategory.name,
                    products: products,
                    subcategories: subcategoriesWithProductCount,
                    numberOfProducts: products.length,
                };
            })
        );

        res.json(subcategoriesWithProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = {
    getRootCategories,
    getSubcategories,
};