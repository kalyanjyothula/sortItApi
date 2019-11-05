const { User } = require("../models/users");

const authentication = (req, res, next) => {
  const token = req.body.token;
  User.findByToken(token)
    .then(user => {
      if (!user) Promise.reject();
      req.user = user;
      req.token = token;
      next();
    })
    .catch(err => {
      res.status(401).send({token});
    });
};

module.exports = { authentication };
