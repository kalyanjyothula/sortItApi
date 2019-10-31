const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  imgUrl: {
    type: String,
    trim: true
  },
  cost: {
    type: Number
  },
  rating: {
    type: Number
  },
  trend: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});
const Products = mongoose.model("Products", productsSchema);
module.exports = { Products };
