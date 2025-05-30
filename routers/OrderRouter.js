const express = require("express");
const OrderDAO = require("../DAO/OrderDAO");
const router = express.Router();
const verifyToken = require('./AuthorizationMiddleware')

// Get all orders for a user
router.get("/:userId", async (req, res) => {

    try {
        const orders = await OrderDAO.getUserOrders(req.params.userId);
        
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    
});

// Create a new order
router.post("/create", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        await OrderDAO.createOrder(userId, productId, quantity);
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/delete:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const deletedOrder = await OrderDAO.deleteOrder(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
