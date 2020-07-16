const mongoose = require("mongoose");
const express = require("express");

//My Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment");
const paymentBRoutes = require("./routes/paymentbroutes");

//environment variables
require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

//DB connection
mongoose
  .connect(process.env.MONGODB_URI || process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//MiddleWares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//my routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);
app.use("/api", paymentBRoutes);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("../projfrontend/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../projfrontend", "build", "index.html")
    );
  });
}

//port
const port = process.env.PORT || 8000;

//starting server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
