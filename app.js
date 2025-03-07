const express = require("express");
const app = express();
const port = 3000;

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const connectDB = require("./db/connect");
require("dotenv").config();
require("express-async-errors");
app.use(express.json());
const authenticate = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Routes definition
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const commentRouter = require("./routes/comments");
const authRouter = require("./routes/auth");

// Routes Recourses
app.get("/", (req, res) => {
  res.send("You have just reached postit backend Server!");
});
app.use("/api/v1/users/", authenticate, userRouter);
app.use("/api/v1/posts/", authenticate, postRouter);
app.use("/api/v1/posts/", authenticate, commentRouter);
app.use("/api/v1/auth/", authRouter);

// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// Error Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Server Control
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error, "error connecting to DB");
  }
};

start();
