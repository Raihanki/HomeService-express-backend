const authenticate = require("./authenticate");

const accountActivated = (req, res, next) => {
  authenticate(req, res, () => {
    if (req.user.isConfirmed) {
      next();
    } else {
      res.status(403).json({ message: "Account not activated" });
    }
  });
};

module.exports = accountActivated;
