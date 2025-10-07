const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv").config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'CHATBASE_API_KEY', 'CHATBASE_BOT_ID'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('💡 Please check your .env file or copy env-template.txt to .env and fill in the values');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => {
      console.warn(
        "⚠️ MongoDB connection failed, continuing without database:",
        err.message
      );
      console.log(
        "💡 To enable database features, check your internet connection and reconnect to the internet"
      );
    });
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));

// Rate limiting
const { generalLimiter, authLimiter, chatLimiter } = require('./middleware/rateLimiter');
app.use(generalLimiter);

// Routes
const authRoutes = require("./routes/auth");
const healthRoutes = require("./routes/health");
const chatRoutes = require("./routes/chat");
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api", healthRoutes);
app.use("/api/chat", chatLimiter, chatRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Maternal Health API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Error handling middleware
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');

// 404 handler
app.use("*", notFound);

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Maternal Health API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
