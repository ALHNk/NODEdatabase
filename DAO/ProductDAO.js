require('dotenv').config();
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String},
    price: { type: Number, required: true }
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Products = mongoose.model("Product", productSchema);

const ProductDAO = {
    async getProducts() {
        return await Products.find({});
    },
    async addProduct(name, price) {
        const newProduct = new Products({ name, price });
        return await newProduct.save();
    },

    async deleteProduct(productId) {
        return await Products.findByIdAndDelete(productId);
    }
};

module.exports = ProductDAO;
