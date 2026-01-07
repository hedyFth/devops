const express = require("express");
const cors = require("cors");

const { notFound, errorHandler } = require("./middlewares/error.middleware");
const apiRoutes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running ✅" });
});

// all API routes
app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
