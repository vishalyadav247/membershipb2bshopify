const jwt = require('jsonwebtoken');

function checkSessionUser(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({
            err: "No token provided, access denied",
            redirect: "/login"
        });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                err: "Invalid or expired token",
                redirect: "/login"
            });
        }

        req.user = user;

        next(); 
    });
};


module.exports = {checkSessionUser};