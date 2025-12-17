const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) {
        return res.status(401).json({
            success:false,
            message: 'Please login first'
        });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        
        next();
    } catch (err) {
        res.status(401).json({
        success: false,
        message: 'Access token is invalid, Logout and login again'
        });
    }
}