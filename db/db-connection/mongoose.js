
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL || "mongodb+srv://kalyan:kalyan@cluster0.wlumz.mongodb.net/miniCart?retryWrites=true&w=majority",
{

    useNewUrlParser: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  
});
mongoose.Promise = global.Promise;
module.exports = {
  mongoose
};