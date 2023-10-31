const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mail = require("../config/mail");
const moment = require("moment");
const { Op } = require("sequelize");
const crypto = require("crypto");

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
    const token = crypto
      .createHash("md5")
      .update(Math.random().toString().substring(2))
      .digest("hex");

    data.confirmedToken = token;
    data.expiredToken = moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss");
    const result = await User.create(data);
    const { password, ...resultWithoutPass } = result.dataValues;

    const html = `
        <div style="background-color: #f2f2f2; padding: 20px;">
            <div style="background-color: #fff; padding: 20px; border-radius: 5px;">
                <h1 style="text-align: center; color: #333;">Welcome to Home Service!</h1>
                <p style="text-align: center; color: #333;">Please click the button below to activate your account:</p>
                <div style="text-align: center;">
                    <a href="${process.env.APP_URL}/auth/activate/${token}" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activate Account</a>
                </div>
            </div>
        </div>
    `;

    await mail.sendMail({
      from: "homeservice@noreply.com",
      to: data.email,
      subject: "Account Activation From Home Service",
      html,
    });

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

const activate = async (req, res) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      where: {
        [Op.and]: [
          { confirmedToken: token },
          {
            expiredToken: {
              [Op.gte]: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
          },
          { isConfirmed: false },
        ],
      },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    await user.update({ isConfirmed: true, confirmedToken: null });
    res.status(200).json({ message: "Account Activated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const reqActivateToken = async (req, res) => {
  const data = {
    email: req.user.email,
  };

  try {
    const user = await User.findOne({
      where: {
        [Op.and]: [{ email: data.email }, { isConfirmed: false }],
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email not found or already activated" });
    }

    const token = crypto
      .createHash("md5")
      .update(Math.random().toString().substring(2))
      .digest("hex");

    await user.update({
      confirmedToken: token,
      expiredToken: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
    });

    const html = `
        <div style="background-color: #f2f2f2; padding: 20px;">
            <div style="background-color: #fff; padding: 20px; border-radius: 5px;">
                <h1 style="text-align: center; color: #333;">Welcome to Home Service!</h1>
                <p style="text-align: center; color: #333;">Please click the button below to activate your account:</p>
                <div style="text-align: center;">
                    <a href="${process.env.APP_URL}/auth/activate/${token}" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activate Account</a>
                </div>
            </div>
        </div>
    `;

    await mail.sendMail({
      from: "homeservice@noreply.com",
      to: data.email,
      subject: "Account Activation From Home Service",
      html,
    });

    res.status(200).json({ message: "Activation Email Sended" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  activate,
  reqActivateToken,
};
