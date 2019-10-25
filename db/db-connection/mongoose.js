
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://kalyan:kalyan@cluster0-wwpg6.mongodb.net/miniCartDB?retryWrites=true&w=majority");
mongoose.Promise = global.Promise;
module.exports = {
  mongoose
};