const express = require('express');
const app = express();
const cors = require('cors')
const connectDb = require('./utils/db');
const router = require('./router/auth-routes')

app.use(express.json());
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}))
app.use("/api/",router)

connectDb().then(() => {
    const port = 5000;
    app.listen(port, () => {
        console.log(`server started at port: ${port}.`)
    })
}) 