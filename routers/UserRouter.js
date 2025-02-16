const User = require('../entities/User');
const UserDao = require('../DAO/UserDao');
const express = require('express')
const path = require('path');
const verifyToken = require('./AuthorizationMiddleware')
const jwt = require('jsonwebtoken');


const router = express.Router();

router.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, "../views/users/read.html"))
});
router.get('/add', (req, res) =>{
    res.sendFile(path.join(__dirname, "../views/users/create.html"))
});

router.post('/login', async (req, res) => {
    const { name, password, role } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        const user = await UserDao.login(name, password);
        const token = jwt.sign(
            {
                userId: user.userId,
                username: user.name
            }, 
            'secret-key',
            {expiresIn:'1h'}
        )
        return res.status(200).json({ message: "Login successful",token: token, id : user.userId, name : user.name, role: user.role});
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
});

router.post('/register', async (req, res) =>{
    const {name, password, role} = req.body;
    // const user = new User(name, password);

    if(!name || !password)
        {
            return res.status(400).json({message:'All fields are required'});
        }
    
    try
    {
        result = await UserDao.create({name, password, role});
        if(result === -1){
            return res.status(400).json({message: 'User Exists'});
        }
        return res.status(201).json({message:'Registerd!!!!!!'});
    }
    catch(err)
    {
        return res.status(500).json({messsage: err});
    }
});
router.get('/admin', verifyToken, (req, res) => 
    {
        res.status(200).json({ 
            message: 'Protected route accessed'           
        });
    });


module.exports = router;