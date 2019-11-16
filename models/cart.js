const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number
  },
  imgUrl: {
    type: String
  },
  cost: {
    type: Number
  },
  name: {
    type: String
  },
  productId: {
    type: String
  }
});

cartSchema.statics.addToCart = function(body) {
  const cart = this;
  return cart.findOne({ userId: body.userId, productId: body.productId });
};

const Cart = mongoose.model("Cart", cartSchema);

module.exports = { Cart };
