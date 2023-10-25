const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    telp: req.body.telp,
  };

  try {
    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword;

    const result = await User.create(data);
    const { password, ...resultWithoutPass } = result.dataValues;

    res.status(201).json({ data: resultWithoutPass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      return res.status(400).json({ message: "Wrong Email or Password" });
    }
    const checkPassword = await bcrypt.compare(data.password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Wrong Email or Password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res
      .status(200)
      .cookie("accesstoken", token, { httpOnly: true })
      .json({ message: "Login Success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
};
