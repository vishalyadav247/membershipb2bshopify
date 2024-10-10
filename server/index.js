const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const cors = require('cors')
const connectDb = require('./utils/db');
const router = require('./router/auth-routes')
const UserAuthDb = require("./models/user-authenticate");
const bcrypt = require('bcrypt');
const { checkSessionUser } = require('./middlewares/isAuth');
const bodyParser = require('body-parser');
require("dotenv").config();

app.use(express.json());
app.use(bodyParser.json());

const accessOptions = process.env.ORIGIN_URL || '*'
app.use(cors({
    origin: accessOptions,
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
        const userToken = jwt.sign({ id: saveUser._id }, process.env.SECRET_KEY, { expiresIn: '24h' });
        return res.status(201).json({
            status: true,
            message: "Super Admin Created",
            user: saveUser,
            token: userToken
        })

    } catch (error) {
        console.log(error, "Error in Super Admin Creation")
    }
});

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

        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '24h' });

        return res.status(200).json({
            status: true,
            message: "User Logged in Successfully",
            token: token
        })

    } catch (error) {
        console.log(error, "Error during Login User")
    }
});

app.get('/api/check-user', function (req, res) {
    const authHeader = req.headers['authorization'];
    console.log(authHeader, "III")
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
        return res.status(200).json({
            user: true,
            msg: "User Already Logged In"
        });
    });
});


app.patch('/api/update_password', checkSessionUser, async (req, res) => {
    const { id } = req.user;
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
        return res.status(200).json({ status: true, message: 'No session to log out.' });
    }
});

app.get('/', (req, res) => {
    res.send("Welocme to Server Ickle Bubba")
});

connectDb().then(() => {
    const port = 5000;
    app.listen(port, () => {
        console.log(`server started at port: ${port}.`)
    })
}).catch((err) => console.log(err, "ERROR in Connection"))
