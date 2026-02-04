const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const databaseConnection = require("../database/database.js");
const bot_routes = require("../routes/bot_routes.js");
// const referral_routes = require("../routes/referral_routes.js");

// const dataBase = require("../database/db.js");

// console.log("coming 1");
// databaseConnection();
// console.log("coming 2");

const PORT = process.env.PORT || 3001;

const app = express();
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ignore certificate validation (not recommended for production)

//middlewares
app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);
app.use(
  cookieParser({
    Authentication: true,
  })
);
app.use(
  cors({
    origin: [
      // "http://localhost:5173",
      "https://worksoftbuddy.qualesce.com","https://www.worksoftbuddy.qualesce.com"
    ],
    // ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

//  connect DB and start server
async function startServer() {
  try {
    await databaseConnection(); // throw if DB fails

    app.use("/api/v1/users", bot_routes);
    // app.use("/api/v1/referral", referral_routes);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed:", error.message);
  }
}

startServer();
