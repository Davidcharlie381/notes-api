const Note = require("../models/note.model");
const User = require("../models/user.model");

const { users } = require("../data");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const cleared = await Promise.allSettled([await User.deleteMany()]);

    if (cleared.length > 0) {
      const seeded = await Promise.allSettled([await User.insertMany(users)]);
      if (!(seeded.length > 0)) {
        return res
          .status(400)
          .json({ success: false, error: "Failed to seed Database" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Database seeded" });
    }
    throw new Error("Maybe it failed");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
