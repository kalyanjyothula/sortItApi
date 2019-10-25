const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const { mongoose } = require("./db/db-connection/mongoose");
const { User } = require("./models/users");
const { authentication } = require("./middleware/authenticate");

const app = express();

const port = process.env.PORT || 4000;

app.use(bodyParser.json());

// ------   public routes ---------

app.post("/signup", (req, res) => {
  const body = _.pick(req.body, ["email", "password", "mobileNo", "userName"]);
  const user = new User(body);
  user
    .save()
    .then(data => {
      return data.generateAuthToken();
    })
    .then(token =>
      res.header("x-auth", token).send({ _id: user._id, email: user.email })
    )
    .catch(err => res.status(400).send(err));
});

app.post("/login", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  User.findByCredentials(body.email, body.password)
    .then(user => {
      return user
        .generateAuthToken()
        .then(token =>
          res.header("x-auth", token).send({ _id: user._id, email: user.email })
        );
    })
    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

app.delete("/logout", authentication, (req, res) => {
  req.user
    .removeToken(req.token)
    .then((data) => res.status(200).send())
    .catch(err => res.status(400).send());
});

//---- private route --------

app.post("/cart", authentication, (req, res) => {
  res.send(req.user);
});

// ------------ server ------
app.listen(port, () => console.log("Application running on port", port));
