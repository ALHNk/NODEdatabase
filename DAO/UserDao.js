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
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "general"], default: "general" }
});

const User = mongoose.model('users', userSchema);

const UserDao = {
    // Register User
    async create(userData) {
        const { name, password, role } = userData;
    
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return -1
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, password: hashedPassword, role });
    
        return await user.save();
    },

  
    // Login User (Fixing issue)
    async login(name, password) {
        const user = await User.findOne({ name });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid password");
        return { userId: user._id, name: user.name, role:user.role };
    }
};

module.exports = UserDao;
