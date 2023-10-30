const {
  Service,
  ServiceCategory,
  User,
  Image,
  ServiceImage,
} = require("../models");
const slug = require("slug");
const cloudinary = require("cloudinary").v2;

const index = async (req, res) => {
  try {
    const results = await Service.findAll({
      include: [
        {
          model: ServiceCategory,
          as: "serviceCategory",
          attributes: { exclude: ["deletedAt"] },
        },
        {
          model: User,
          as: "user",
          attributes: { exclude: ["password", "deletedAt"] },
        },
        {
          model: Image,
          as: "images",
          attributes: { exclude: ["deletedAt", "createdAt", "updatedAt"] },
        },
      ],
      attributes: { exclude: ["deletedAt"] },
    });
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const store = async (req, res) => {
  if (!req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  let uploadedImages = [];
  try {
    if (req.files?.images !== undefined) {
      let images = req.files.images;
      if (!Array.isArray(images)) {
        images = [images];
      }
      for (let i = 0; i < images.length; i++) {
        const image = await cloudinary.uploader.upload(images[i].tempFilePath, {
          folder: "HomeService/Services",
        });
        uploadedImages.push(image);
      }
    } else {
      return res.status(400).json({ message: "Images required" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }

  const data = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    serviceCategoryId: req.body.serviceCategoryId,
    userId: req.user.id,
  };

  try {
    const category = await ServiceCategory.findOne({
      where: { id: data.serviceCategoryId },
    });
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    data.slug = slug(data.name + "-" + Math.floor(Math.random() * 99999), {
      lower: true,
    });
    data.serviceCategoryId = category.id;
    const result = await Service.create(data);

    uploadedImages.forEach(async (image) => {
      const storedImage = await Image.create({
        url: image.secure_url,
        imagePublicId: image.public_id || null,
      });
      if (storedImage) {
        await ServiceImage.create({
          serviceId: result.id,
          imageId: storedImage.id,
        });
      }
    });

    res.status(201).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const show = async (req, res) => {
  const id = req.params.id;

  try {
    const service = await Service.findOne({
      where: { id: id },
      include: [
        {
          model: ServiceCategory,
          as: "serviceCategory",
          attributes: { exclude: ["deletedAt"] },
        },
        {
          model: User,
          as: "user",
          attributes: { exclude: ["password", "deletedAt"] },
        },
      ],
      attributes: { exclude: ["deletedAt"] },
    });
    if (!service) {
      return res.status(400).json({ message: "Service not found" });
    }

    res.status(200).json({ data: service });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  if (!req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }

  const data = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    serviceCategoryId: req.body.serviceCategoryId,
    userId: req.user.id,
  };

  try {
    const service = await Service.findOne({ where: { id: req.params.id } });
    if (!service) {
      return res.status(400).json({ message: "Service not found" });
    }

    if (service.userId != req.user.id) {
      return res.status(403).json({ message: "Access Forbiden" });
    }

    const category = await ServiceCategory.findOne({
      where: { id: data.serviceCategoryId },
    });
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }

    data.slug = slug(data.name + "-" + Math.floor(Math.random() * 99999), {
      lower: true,
    });
    data.serviceCategoryId = category.id;

    const result = await service.update(data);

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const destroy = async (req, res) => {
  if (!req.user.isSeller) {
    return res.status(403).json({ message: "Access Forbiden" });
  }
  const id = req.params.id;

  try {
    const service = await Service.findOne({ where: { id: id } });
    if (!service) {
      return res.status(400).json({ message: "Service not found" });
    }
    if (service.userId != req.user.id) {
      return res.status(403).json({ message: "Access Forbiden" });
    }

    await service.destroy();
    res.status(200).json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  index,
  store,
  show,
  update,
  destroy,
};
