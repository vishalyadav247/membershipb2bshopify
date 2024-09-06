const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017/Ickle_Bubba';
const connectDb = async () => {
    try {
        await mongoose.connect(URI)
        console.log('DB connected')
    } catch (error) {
        console.error('db connect failed')
        process.exit(0)
    }
}

module.exports = connectDb;