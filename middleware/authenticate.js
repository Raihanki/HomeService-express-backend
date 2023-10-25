const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticate = (req, res, next) => {
  const token = req.cookies.accesstoken;
  if (!token) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
    const user = await User.findOne({ where: { id: data.id } });
    req.user = user;
    next();
  });
};

module.exports = authenticate;
