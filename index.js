const express = require('express')
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 8069;
require('dotenv').config();
const mongoose = require('mongoose');
const userRouter = require('./routers/UserRouter')
const orderRouter = require('./routers/OrderRouter')
const productRouter = require('./routers/productRouter')


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

connectDB();
const app = express();

app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, "VIEWS/index.html"));
});
app.get('/dashboard', (req, res) =>{
    res.sendFile(path.join(__dirname, "VIEWS/orders/dashboard.html"));
});

app.use(cors());
app.use(express.json());

app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/products', productRouter);
app.listen(port,() => console.log(`Server running on port ${port}`));
