const express = require('express');
const app = express();
const cors = require('cors')
const connectDb = require('./utils/db');
const router = require('./router/auth-routes')

app.use(express.json());
app.use(cors())
app.use("/",router)

connectDb().then(() => {
    const port = 4000;
    app.listen(port, () => {
        console.log(`server started at port: ${port}.`)
    })
}) 