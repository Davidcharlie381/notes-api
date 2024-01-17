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

  static async getSingleUser(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: `User with id ${id} not found` });
      }
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async registerUser(req, res) {
    const { email, password } = req.body;

    try {
      if (!(email && password)) {
        return res.status(400).json({
          success: false,
          error: "One or more required fields is missing",
        });
      }
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

  static async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      if (!(email && password)) {
        return res.status(400).json({
          success: false,
          error: "One or more required fields is missing",
        });
      }
      const userExists = await User.findOne({ email });

      if (!userExists) {
        return res
          .status(404)
          .json({ success: false, error: "User not registered" });
      }

      const passwordCorrect = await bcrypt.compare(
        password,
        userExists.password
      );

      if (!passwordCorrect) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      const token = await generateToken(userExists._id);

      res.status(200).json({
        success: true,
        data: userExists,
        token,
        message: "Log in successful",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async updateUser(req, res) {
    const { username, role } = req.body;
    const { id } = req.params;
    try {
      if (!username && !role) {
        return res
          .status(400)
          .json({ success: false, error: "Provide username or role" });
      }
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: `Couldn't find user with id ${id}` });
      }

      username && (user.username = username);
      role && (user.role = role);
      await user.save();

      res.status(201).json({
        success: true,
        message: `${
          username
            ? "Username updated successfully"
            : role
            ? "Role updated successfully"
            : "Username and role updated successfully"
        }`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: `User with id ${id} not found` });
      }
      res.status(200).json({
        success: true,
        message: `User with id ${id} deleted successfully`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }

  static async deleteAllUsers(req, res) {
    try {
      const result = await User.deleteMany({ role: "admin" || "user" });
      res
        .status(200)
        .json({
          success: true,
          message: `Deleted ${result.deletedCount} users`,
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = UserController;
