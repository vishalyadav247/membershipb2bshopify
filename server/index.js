const express = require('express');
const app = express();
const session = require('express-session');
const mongoStore = require('connect-mongo');
const cors = require('cors')
const connectDb = require('./utils/db');
const router = require('./router/auth-routes')
const UserAuthDb = require("./models/user-authenticate");
const bcrypt = require('bcrypt');
const { checkSessionUser } = require('./middlewares/isAuth');

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({ mongoUrl: 'mongodb://localhost/session-db' }),
    cookie: { secure: false, maxAge: 86400000, httpOnly: true } // For 1 Day
}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use("/api/", router);

app.post('/api/create_admin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ err: "All Fields are required" });
    };

    try {
        const existingUser = await UserAuthDb.findOne({ email: email });

        if (existingUser) {
            return res.status(401).json({ err: "This user email already exists" });
        };

        const hashedPass = bcrypt.hashSync(password, 10);

        const response = new UserAuthDb({ email: email, password: hashedPass });
        const saveUser = await response.save();
        return res.status(201).json({
            status: true,
            message: "Super Admin Created",
            data: saveUser
        })

    } catch (error) {
        console.log(error, "Error in Super Admin Creation")
    }

})

app.post('/api/login_admin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ err: "All Fields are required" });
    };

    try {
        const existingUser = await UserAuthDb.findOne({ email: email })

        if (!existingUser) {
            return res.status(401).json({ err: "Invalid email credential" });
        };
        if (!(bcrypt.compareSync(password, existingUser.password))) {
            return res.status(401).json({ err: "Invalid Password" })
        };

        req.session.userId = existingUser._id;

        req.session.save((err) => {
            if (err) {
                res.status(401).json({
                    message: "Unable to save the session"
                });
            };
            return res.status(200).json({
                status: true,
                message: "User credentials Matched",
                userData: existingUser
            })

        });

        console.log("Session after login:", req.session);

    } catch (error) {
        console.log(error, "Error during Login User")
    }
});

app.get('/api/check-user', function (req, res) {
    console.log(req.session, "CHECK")
    if (req.session.userId) {
        res.status(200).json({
            user: true,
            msg: "User Already Logged In"
        })
    } else {
        res.status(401).json({
            user: false,
            msg: "Session is Expired, Please Login Again"
        });
    };
});

app.patch('/api/update_password', checkSessionUser, async (req, res) => {
    const id = req.session.userId;
    const { password } = req.body;

    const hashedPass = bcrypt.hashSync(password, 10);

    try {
        await UserAuthDb.findByIdAndUpdate(id, { password: hashedPass }, { new: true });

        return res.status(200).json({
            status: true,
            message: "Your Password has been changed successfully",
        });

    } catch (error) {
        console.log(error, "Internal Error : Password Not Changed")
    }
});

app.get('/api/logout_admin', async (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: "Failed to Logout"
                })
            };

            res.clearCookie('connect.sid');
            res.status(200).json({ status: true, message: 'Logged out successfully.' });
        })
    } else {
        res.status(200).json({ status: true, message: 'No session to log out.' });
    }
});



connectDb().then(() => {
    const port = 5000;
    app.listen(port, () => {
        console.log(`server started at port: ${port}.`)
    })
}).catch((err) => console.log(err, "ERROR in Connection"))