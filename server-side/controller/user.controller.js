const bcrypt = require("bcryptjs");
const User = require("../modal/user.modal");
const { generateToken } = require("../utils");
module.exports = {
  createUser: async (req, res) => {
    const { name, email, mobileNumber, password } = req.body;
    if (!name || !email || !mobileNumber || !password) {
      return res
        .status(400)
        .send({ message: "Please fill the required fields!" });
    }
    try {
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return res.status(409).send({ message: "Email already exist!" });
      }
      const user = await User.create(req.body);
      if (user) {
        res.status(201).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
        });
      } else {
        throw new Error("Failed to create the user!");
      }
    } catch (error) {
      console.log("Create User Controller Error: ", error.message);
      res.status(500).send({ message: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    const { search = "", page = 0, limit = 10 } = req.query;
    try {
      const query = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { mobileNumber: { $regex: search, $options: "i" } },
            ],
          }
        : {};
      const users = await User.find(query, { password: 0 })
        .skip(page * limit)
        .limit(limit)
        .sort({ _id: -1 });
      const totalUsers = await User.countDocuments(query);
      res.status(200).send({ users, totalUsers });
    } catch (error) {
      console.log("Get all users Controller Error: ", error.message);
      res.status(500).send({ message: error.message });
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "User Id params not sended!" });
    }
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (deletedUser) {
        res.status(200).send(`User ${deletedUser.name} deleted successfully.`);
      } else {
        res.status(400).send({ message: "User not found!" });
      }
    } catch (error) {
      console.log("deleteUser Controller Error: ", error.message);
      res.status(500).send({ message: error.message });
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "User Id params not sended!" });
    }
    const { name, email, mobileNumber, password } = req.body;
    if (!name || !email || !mobileNumber || !password) {
      return res
        .status(400)
        .send({ message: "Please fill the required fields!" });
    }
    try {
      const isEmailExist = await User.findOne({ _id: { $ne: id }, email });
      if (isEmailExist) {
        return res.status(409).send({ message: "Email already registered!" });
      }
      let salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
      let hash = bcrypt.hashSync(req.body.password, salt);
      const user = await User.findByIdAndUpdate(id, {...req.body, password: hash}, { new: true });
      if (user) {
        res.status(200).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
        });
      } else {
        throw new Error("Failed to update the user!");
      }
    } catch (error) {
      console.log("updateUser Controller Error: ", error.message);
      res.status(500).send({ message: error.message });
    }
  },
  getUserById: async (req, res) => {
    const id = req.params.id || req.loggedInUserId;
    if (!id) {
      return res.status(400).send({ message: "User Id params not sended!" });
    }
    try {
      const user = await User.findById(id, { password: 0 });
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ message: "User not found!" });
      }
    } catch (error) {
      console.log("getUserById Controller Error: ", error.message);
      res.status(500).send({ message: error.message });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res
          .status(404)
          .send({ error: "Email and Password is required!" });
      }
      const user = await User.findOne({ email });
      console.log(user);
      if (user && (await user.matchPassword(password))) {
        res.status(200).send({
          _id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
          token: generateToken({ _id: user._id }),
        });
      } else {
        res.status(404).send({ error: "Invalid email or password!" });
      }
    } catch (error) {
      console.log("loginUser Controller Error: ", error.message);
      res.status(500).send({ error: error.message });
    }
  },
  getUserInfo: async (req, res) => {
    const id = req.loggedInUserId;
    try {
      const user = await User.findById(id, { password: 0 });
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send({ message: "User not found!" });
      }
    } catch (error) {
      console.log("getUserInfo Controller Error: ", error.message);
      res.status(500).send({ message: error.message });
    }
  },
};
