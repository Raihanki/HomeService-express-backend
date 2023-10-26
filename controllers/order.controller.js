const { Order, Service } = require("../models");
const { Op } = require("sequelize");

const index = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        ...(req.user.isSeller
          ? { sellerId: req.user.id }
          : { buyerId: req.user.id }),
      },
    });

    res.status(200).json({ data: orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const store = async (req, res) => {
  if (req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  const data = {
    userId: req.user.id,
    status: "PENDING",
  };

  try {
    const service = await Service.findOne({ where: { id: req.params.id } });
    if (!service) {
      return res.status(400).json({ message: "Service not found" });
    }
    data.serviceId = service.id;

    Order.create(data);
    res.status(201).json({ message: "Order created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const show = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id },
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    res.status(200).json({ data: order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptOrder = async (req, res) => {
  if (!req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }
  try {
    const order = await Order.findOne({
      where: {
        [Op.and]: [{ id: req.params.id }, { isCanceling: false }],
      },
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    if (order.sellerId != req.user.id) {
      return res.status(403).json({ message: "Access Forbiden" });
    } else if (order.status != "PENDING") {
      return res.status(400).json({ message: "Order already accepted" });
    }

    await order.update({ status: "ACCEPTED" });
    res.status(200).json({ message: "Order accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const requestProcessOrder = async (req, res) => {
  const id = req.params.id;
  if (!req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  try {
    const order = await Order.findOne({
      where: {
        [Op.and]: [{ id: id }, { status: "ACCEPTED" }, { isCanceling: false }],
      },
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    const service = await Service.findOne({ where: { id: order.serviceId } });
    if (service.userId != req.user.id) {
      return res.status(403).json({ message: "Access Forbiden" });
    }

    await order.update({ status: "REQ_ONPROCESS" });
    res.status(200).json({ message: "Request Sended" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptProcessOrder = async (req, res) => {
  const id = req.params.id;
  if (req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }
  try {
    const order = await Order.findOne({
      where: {
        [Op.and]: [
          { id: id },
          { status: "REQ_ONPROCESS" },
          { userId: req.user.id },
          { isCanceling: false },
        ],
      },
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    await order.update({ status: "ONPROCESS" });
    res.status(200).json({ message: "Status Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const requestSuccessOrder = async (req, res) => {
  const id = req.params.id;
  if (!req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  try {
    const order = await Order.findOne({
      where: {
        [Op.and]: [{ id: id }, { status: "ONPROCESS" }, { isCanceling: false }],
      },
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    const service = await Service.findOne({ where: { id: order.serviceId } });
    if (service.userId != req.user.id) {
      return res.status(403).json({ message: "Access Forbiden" });
    }

    await order.update({ status: "REQ_SUCCESS" });
    res.status(200).json({ message: "Request Sended" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptSuccessOrder = async (req, res) => {
  const id = req.params.id;
  if (req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  try {
    const order = await Order.findOne({
      where: {
        [Op.and]: [
          { id: id },
          { status: "REQ_SUCCESS" },
          { userId: req.user.id },
          { isCanceling: false },
        ],
      },
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    await order.update({ status: "SUCCESS" });
    res.status(200).json({ message: "Status Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const requestCancelOrder = async (req, res) => {
  const id = req.params.id;
  if (!req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  try {
    const order = await Order.findOne({
      where: {
        [Op.and]: [{ id }, { isCanceling: false }],
      },
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    if (order.userId != req.user.id) {
      return res.status(403).json({ message: "Access Forbiden" });
    }

    await order.update({ isCanceling: true });
    res.status(200).json({ message: "Request Sended" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const acceptCancelOrder = async (req, res) => {
  const id = req.params.id;
  if (req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  try {
    const order = await Order.findOne({
      where: {
        [Op.and]: [{ id }, { isCanceling: true }],
      },
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    await order.update({ status: "CANCEL", isCanceling: false });
    res.status(200).json({ message: "Order Canceled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  index,
  store,
  show,
  acceptOrder,
  requestProcessOrder,
  acceptProcessOrder,
  requestSuccessOrder,
  acceptSuccessOrder,
  requestCancelOrder,
  acceptCancelOrder,
};
