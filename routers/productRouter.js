const express = require("express");
const ProductDAO = require("../DAO/ProductDAO");
const router = express.Router();

// Get all orders for a user
router.get("/get", async (req, res) => {
    try {
        const products = await ProductDAO.getProducts();
        const response = products.map(product => ({
            id: product._id,
            name: product.name,
            price: product.price
        }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
