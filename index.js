const express = require('express')
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 8069;
require('dotenv').config();
const mongoose = require('mongoose');
const userRouter = require('./routers/UserRouter');
const orderRouter = require('./routers/OrderRouter');
const productRouter = require('./routers/productRouter');
const ProductDAO = require('./DAO/ProductDAO');



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            tls: true, 
            tlsAllowInvalidCertificates: false,  
            serverSelectionTimeoutMS: 6000, 
        });
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error(" MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;

connectDB();
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, "views/index.html"));
});
app.get('/admin-prod', async (req, res) => {
    try {
        const products = await ProductDAO.getProducts();
        res.render('products/prod', { products }); 
    } catch (err) {
        res.status(500).send("Error loading products");
    }
});
app.post('/admin-prod/add', async (req, res) => {
    const { name, price } = req.body;
    await ProductDAO.addProduct(name, price);
    res.redirect('/admin-prod'); 
});

app.delete('/admin-prod/delete/:id', async (req, res) => {
    await ProductDAO.deleteProduct(req.params.id);
    res.json({ success: true });
});
app.get('/dashboard', (req, res) =>{
    res.sendFile(path.join(__dirname, "views/orders/dashboard.html"));
});

app.use(cors());
app.use(express.json());

app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/products', productRouter);
app.listen(port,() => console.log(`Server running on port ${port}`));
