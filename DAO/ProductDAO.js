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
    }
};

module.exports = ProductDAO;
