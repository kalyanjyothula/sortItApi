const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const _ = require("lodash");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid Email"
    }
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  // mobileNo: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   unique: true,
  //   validate: {
  //     validator: /\d{10}$/,
  //     message: "{VALUE} is not a valid mobile number"
  //   }
  // },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  tokens: [
    {
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = "auth";
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, "secret: sortIt@Kalyan")
    .toString();
  user.tokens.push({ access, token });

  return user.save().then(() => token);
};

userSchema.methods.removeToken = function(token) {
  let user = this;
  return user.update({
    $pull: {
      tokens: { token }
    }
  });
};

userSchema.statics.findByToken = function(token) {
  const user = this;
  let decode;
  try {
    decode = jwt.verify(token, "secret: sortIt@Kalyan");
  } catch (err) {
    return Promise.reject();
  }
  return user.findOne({
    _id: decode._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

userSchema.statics.findByCredentials = function(email, password) {
  const user = this;
  return user.findOne({ email }).then(data => {
    if (!data) return Promise.reject({ err: "user not found!" });
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, data.password, (err, res) => {
        if (res) resolve(data);
        else reject({ err: "Invalid password!" });
      });
    });
  });
};

userSchema.pre("save", function(next) {
  let user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else next();
});
const User = mongoose.model("User", userSchema);

module.exports = { User };
