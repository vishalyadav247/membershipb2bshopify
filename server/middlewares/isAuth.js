
function checkSessionUser(req, res, next) {
    console.log("Session on protected route:", req.session);
    if (!req.session.isAuth) {
       return res.status(401).json({
            redirect: "/login"
        });
    };

    next(); 
};

module.exports = {checkSessionUser};