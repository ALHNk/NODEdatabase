const User = require('../entities/User');
const UserDao = require('../DAO/UserDao');
const express = require('express')
const path = require('path');

const router = express.Router();

router.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, "../VIEWS/users/read.html"))
});
router.get('/add', (req, res) =>{
    res.sendFile(path.join(__dirname, "../VIEWS/users/create.html"))
});

router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await UserDao.login(name, password);
        return res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
});

router.post('/register', async (req, res) =>{
    const {name, password} = req.body;
    const user = new User(name, password);

    if(!name || !password)
        {
            return res.status(400).json({message:'All fields are required'});
        }
    
    try
    {
        await UserDao.create(user);
        return res.status(201).json({message:'Registerd!!!!!!'});
    }
    catch(err)
    {
        return res.status(500).json({messsage: err});
    }
});


module.exports = router;