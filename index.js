const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

// user routes
const authRoutes = require("./routes/auth.route.js");
const serviceRoutes = require("./routes/service.route.js");
const serviceCategoryRoutes = require("./routes/serviceCategory.route.js");
const orderRoutes = require("./routes/order.route.js");
const reviewRoutes = require("./routes/review.route.js");

const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(fileUpload());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/categories", serviceCategoryRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
