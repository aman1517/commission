const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ This parses incoming JSON bodies

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/commissions", require("./routes/commissionRoutes"));
app.use("/api/files", require("./routes/fileRoutes"));

// Error handler
app.use(errorHandler);

module.exports = app;
