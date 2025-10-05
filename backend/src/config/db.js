const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI)
        if(db) {
          console.log('Database connected!!',db.connection.host,db.connection.name);
        }
    }catch(error){
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

module.exports = connectDB;
