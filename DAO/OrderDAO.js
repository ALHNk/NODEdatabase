require('dotenv').config();
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

const OrderDAO = {
    async getUserOrders(userId) {
        return await Order.find({ userId }).populate("productId", "name ")  
        .select("_id productId quantity status createdAt");
    },

    async createOrder(userId, productId, quantity) {
        return await Order.create({ userId, productId, quantity });
    },
    async deleteOrder(orderId) {
        return await Order.findByIdAndDelete(orderId);
    }
};

module.exports = OrderDAO;
