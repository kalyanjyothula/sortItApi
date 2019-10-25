const { User } = require("../models/users");

const authentication = (req, res, next) => {
  const token = req.header("x-auth");
  User.findByToken(token)
    .then(user => {
      if (!user) Promise.reject();
      req.user = user;
      req.token = token;
      next();
    })
    .catch(err => {
      res.status(401).send();
    });
};

module.exports = { authentication };
