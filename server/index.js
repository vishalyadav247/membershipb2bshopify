const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors')
const connectDb = require('./utils/db');
const router = require('./router/auth-routes')
const UserAuthDb = require("./models/user-authenticate");
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:process.env.NODE_ENV === 'production', maxAge:30000, httpOnly:true}
}));


app.use("/api/",router);

function checkSessionUser(req, res, next) {
    if (!req.session.isAuth) {
        next();  // Proceed if authenticated
    } else {
        res.status(401).json({
            redirect: "/login"
        });
    }
}

app.post('/create_admin', async( req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
       return res.status(401).json({err:"All Fields are required"});
    };

    try {
        const existingUser = await UserAuthDb.findOne({email:email});

        if(existingUser){
            return res.status(401).json({err:"This user email already exists"});
        };

        const hashedPass = bcrypt.hashSync(password, 10);

        const response = new UserAuthDb({email:email, password:hashedPass});
        const saveUser = await response.save();
        return res.status(201).json({
            status:true,
            message:"Super Admin Created",
            data:saveUser
        })
        
    } catch (error) {
        console.log(error,"Error in Super Admin Creation")
    }

}) 

app.post('/login_admin', checkSessionUser , async( req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
       return res.status(401).json({err:"All Fields are required"});
    };

    try {
        const existingUser = await UserAuthDb.findOne({email:email})

        if(!existingUser){
            return res.status(401).json({err:"Invalid email credential"});
        };
        if(!(bcrypt.compareSync(password, existingUser.password))){
            return res.status(401).json({err:"Invalid Password"})
        };

        req.session.isAuth = true;

        return res.status(200).json({
            status:true,
            message:"User credentials Matched",
            userData:existingUser
        })
        
    } catch (error) {
        console.log(error,"Error during Login User") 
    }
});

app.get('/logout_admin', async(req, res)=>{
    if(req.session){
        req.session.destroy((err)=>{
           if(err){
            return res.status(500).json({
                status:false,
                message:"Failed to Logout"
            })
           };

           res.clearCookie('connect.sid');
           res.status(200).json({ status: true, message: 'Logged out successfully.' });
        })
    }else {
        res.status(200).json({ status: true, message: 'No session to log out.' });
    }
})


connectDb().then(() => {
    const port = 5000;
    app.listen(port, () => {
        console.log(`server started at port: ${port}.`)
    })
}).catch((err)=> console.log(err,"ERROR in Connection"))