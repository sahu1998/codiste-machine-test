const express = require("express");
const cors = require("cors");
require("dotenv").config();

const UserRoutes = require("./routes/user.route");
const { connectDb } = require("./dbConnection");
connectDb();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/user", UserRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server Started at port ${process.env.PORT}`);
});
