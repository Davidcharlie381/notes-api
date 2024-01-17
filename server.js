const express = require("express");
const connectDB = require("./config/connectDb");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });

const noteRouter = require("./routes/note.route");
const userRouter = require("./routes/user.route");
const seedRouter = require("./routes/seed.route");

app.get("/", (req, res) => {
  res.send("<h1>Welcome to notes app</h1>");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/seed", seedRouter);

app.listen(PORT, () => {
  console.log(`App running on port: ${PORT}`);
});
