const mongoose = require("mongoose");
const colors = require("colors");

// MongoDB connection

const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `Successfully Connected with Database of PORT: ${mongoose.connection.host}`
        .bgGreen,
    );

    await mongoose.connection.syncIndexes();

    console.log("Index Synced".bgMagenta);
  } catch (error) {
    console.log("DB Connection Error: ", error, colors.bgRed);
    process.exit(1);
  }
};

module.exports = connectDB;
