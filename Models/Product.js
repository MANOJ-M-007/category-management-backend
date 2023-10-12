const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    ancestors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    price: {
        type: Number,
        required: true
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
