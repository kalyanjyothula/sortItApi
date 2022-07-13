const mongoose = require("mongoose");

try {
  mongoose.connect(
    process.env.MONGODB_URL ||
      "mongodb+srv://KalyanJyothula:Kalyan@123@cluster0.9li59.mongodb.net/sortItDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      // useFindAndModify: false,
      useUnifiedTopology: true,
    }
  );
} catch (err) {
  console.log("COnnection Error");
}
mongoose.Promise = global.Promise;
module.exports = {
  mongoose,
};
