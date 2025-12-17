const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

exports.register = async (req,res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({email});

        if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = await User.create({
            name,
            email,
            password:hashedPassword,
        })

        const token = generateToken(newUser._id);

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
            token,
        });
    } catch (err) {
        console.error('Registration error:',err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

exports.login = async (req,res) => {
    try {
        const { email,password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid credentials'
        });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
            success: false,
            message: 'Invalid credentials'
        });
        }

        const token = generateToken(user._id);
        
        return res.status(200).json({
            success:true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token,
            })
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
        success: false,
        message: 'Server error'
        })
    }
}