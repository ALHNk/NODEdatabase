require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('users', userSchema);

const UserDao = {
    // Register User
    async create(userData) {
        const { name, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, password: hashedPassword });
        return await user.save();
    },

    // Get All Users (for debugging)
    async read() {
        return await User.find({}, { password: 0 }); // Exclude password from results
    },

    // Login User (Fixing issue)
    async login(name, password) {
        const user = await User.findOne({ name });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid password");
        return { userId: user._id, name: user.name };
    }
};

module.exports = UserDao;
