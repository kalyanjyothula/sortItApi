const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const { mongoose } = require("./db/db-connection/mongoose");
const { User } = require("./models/users");
const { Products } = require("./models/products");
const { authentication } = require("./middleware/authenticate");

const app = express();

const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization , X-Api-Key"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, GET, DELETE");
    return res.status(200).json({});
  }
  next();
});
// ------   public routes ---------

app.post("/api/signup", (req, res) => {
  const body = _.pick(req.body, ["email", "password", "mobileNo", "userName"]);
  const user = new User(body);
  user
    .save()
    .then(data => {
      return data.generateAuthToken();
    })
    .then(token =>
      res
        .header("x-auth", token)
        .send({ success: true, _id: user._id, email: user.email, token })
    )
    .catch(err => res.status(400).send(err));
});

app.post("/api/login", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user
        .generateAuthToken()
        .then(token =>
          res
            .header("x-auth", token)
            .send({ success: true, _id: user._id, email: user.email, token })
        );
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

app.delete("/api/logout", authentication, (req, res) => {
  req.user
    .removeToken(req.body.token)
    .then(data => res.status(200).send({success: true}))
    .catch(err => res.status(400).send());
});
//---- products ------

app.get("/api/products", (req, res) => {
  Products.find()
    .then(data => res.send({ data }))
    .catch(err => res.status(404).send(err));
});

app.post("/api/products", (req, res) => {
  const body = _.pick(req.body, [
    "name",
    "imgUrl",
    "cost",
    "rating",
    "trend",
    "description"
  ]);

  const Product = new Products(body);
  return Product.save()
    .then(data => res.send({ success: true, name: data.name }))
    .catch(err => res.status(404).send(err));
});

//---- private route --------

app.post("/api/cart", authentication, (req, res) => {
  res.send(req.user);
});

// ------------ server ------
app.listen(port, () => console.log("Application running on port", port));
