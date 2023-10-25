const { ServiceCategory } = require("../models");

const index = async (req, res) => {
  try {
    const results = await ServiceCategory.findAll();
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const store = async (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
  };

  try {
    const results = await ServiceCategory.create(data);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  const data = {
    name: req.body.name,
    description: req.body.description,
  };

  try {
    const serviceCategory = await ServiceCategory.findOne({
      where: { id: id },
    });
    if (!serviceCategory) {
      return res.status(400).json({ message: "Service Category not found" });
    }

    const result = await serviceCategory.update(data);

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const destroy = async (req, res) => {
  const id = req.params.id;
  try {
    const serviceCategory = await ServiceCategory.findOne({
      where: { id: id },
    });
    if (!serviceCategory) {
      return res.status(400).json({ message: "Service Category not found" });
    }

    await serviceCategory.destroy();
    res.status(200).json({ message: "Service Category deleted" });
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
