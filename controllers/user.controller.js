const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/token");

class UserController {
  static async getUsers(req, res) {
    try {
      const users = await User.find().select("-password");
      res.status(200).json({ success: true, data: users });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getSingleUser() {}

  static async registerUser(req, res) {
    const { email, password } = req.body;

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res
          .status(409)
          .json({ success: false, message: "User with email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        email,
        password: hashedPassword,
      });

      const token = await generateToken(newUser._id);

      await newUser.save();

      res.status(201).json({
        success: true,
        data: newUser,
        token,
        message: "User created successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async loginUser() {}

  static async updateUser() {}

  static async deleteUser() {}
}

module.exports = UserController;
