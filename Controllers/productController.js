const asyncHandler = require('express-async-handler')
const Category = require('../Models/Category')
const Product = require("../Models/Product");


const saveProduct = asyncHandler(async (req, res) => {
  const { name, category, price, ancestors } = req.body;

  try {
    const newProduct = new Product({
      name: name,
      category: category,
      price: price,
      ancestors: ancestors,
    });

    await newProduct.save();

    const foundCategory = await Category.findById(category);

    if (foundCategory) {
      foundCategory.products.push(newProduct._id);
      await foundCategory.save();
    } else {
      console.error("Category not found");
    }

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
})
module.exports = {
  saveProduct
}