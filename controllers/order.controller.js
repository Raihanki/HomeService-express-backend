const { Order, Service, User } = require("../models");
const { Op } = require("sequelize");
const { cancelOrderQueue } = require("../queues");

const index = async (req, res) => {
  try {
    let orders;
    if (!req.user.isSeller) {
      orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: Service,
            as: "service",
            attributes: ["name", "description", "price", "createdAt"],
          },
          {
            model: User,
            as: "user",
            attributes: ["name", "email", "address", "telp"],
          },
        ],
      });
    } else {
      orders = await Order.findAll({
        include: [
          {
            model: Service,
            as: "service",
            where: { userId: req.user.id },
            attributes: ["name", "description", "price", "createdAt"],
          },
          {
            model: User,
            as: "user",
            attributes: ["name", "email", "address", "telp"],
          },
        ],
      });
    }

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
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["userId"],
        },
      ],
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    if (order.service.userId != req.user.id) {
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
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["userId"],
        },
      ],
    });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    if (order.service.userId != req.user.id) {
      return res.status(403).json({ message: "Access Forbiden" });
    }

    await order.update({ isCanceling: true });

    // Add to queue
    cancelOrderQueue.add(
      { orderId: order.id },
      {
        delay: 60000,
      }
    );

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

cancelOrderQueue.process(async (job) => {
  console.log("cancelOrderQueue started for Job ID:", job.id);
  try {
    const orderId = job.data.orderId;
    const order = await Order.findOne({ where: { id: orderId } });
    if (order.isCanceling) {
      await order.update({
        isCanceling: false,
        status: "CANCEL",
      });
    }
    console.log("cancelOrderQueue completed for Job ID:", job.id);
  } catch (err) {
    console.log(err);
    console.log("cancelOrderQueue completed for Job ID:", job.id);
  }
});

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
