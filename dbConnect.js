const mongoose = require("mongoose");
require("dotenv").config(); 

module.exports = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        const connect = await mongoose.connect(mongoUri, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
