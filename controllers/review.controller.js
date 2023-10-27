const { User, Review, Service, Order } = require("../models");
const { Op } = require("sequelize");

const index = async (req, res) => {
  const id = req.params.id;
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email", "address", "telp"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["name", "price"],
          where: { id },
        },
      ],
    });
    res.status(200).json({ data: reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const store = async (req, res) => {
  const id = req.params.id;
  if (req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  try {
    const service = await Service.findOne({ where: { id } });
    if (!service) {
      return res.status(400).json({ message: "Service not found" });
    }

    const checkReview = await Review.findOne({
      where: { userId: req.user.id, serviceId: id },
    });
    if (checkReview) {
      return res.status(400).json({ message: "Review already exist" });
    }

    const order = await Order.findOne({
      where: {
        [Op.and]: [
          { userId: req.user.id },
          { serviceId: id },
          { status: "SUCCESS" },
        ],
      },
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    const review = await Review.create({
      userId: req.user.id,
      serviceId: service.id,
      comment: req.body.comment,
      rating: req.body.rating,
    });

    res.status(201).json({ data: review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  if (req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  try {
    const review = await Review.findOne({ where: { id } });
    if (!review) {
      return res.status(400).json({ message: "Review not found" });
    }

    if (review.userId != req.user.id) {
      return res.status(403).json({ message: "Access Forbiden" });
    }

    const newReview = await review.update({
      comment: req.body.comment,
      rating: req.body.rating,
    });
    res.status(200).json({ data: newReview });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const destroy = async (req, res) => {
  const id = req.params.id;
  if (req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  try {
    const review = await Review.findOne({ where: { id } });
    if (review.userId != req.user.id) {
      return res.status(403).json({ message: "Access Forbiden" });
    }

    await review.destroy();
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  index,
  store,
  update,
  destroy,
};
