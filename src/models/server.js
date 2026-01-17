const express = require("express");
const path = require("path");
const { dbConnection } = require("../database/config");
const bodyParser = require("body-parser");
require('dotenv').config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5001;

    this.server = require('http').createServer(this.app);
    const io = require('socket.io')(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    module.exports.io = io;
    require('../services/socket');

    // Connect to DB
    this.conectarDB();

    // Middlewares
    this.middlewares(io);

    // Routes
    this.routes();
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  middlewares(io) {
    this.app.set('trust proxy', 1);
    this.app.use(express.static("public"));
    this.app.use(express.json());

    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
      res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
      res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
      next();
    });

    this.app.use(bodyParser.json({ limit: "20mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

    this.app.use(function (req, res, next) {
      req.io = io;
      next();
    });
  }

  async conectarDB() {
    await dbConnection();
  }

  routes() {
    this.app.use("/api/v1/auth", require("../routes/authRoutes"));
    this.app.use("/api/v1/users", require("../routes/userRoutes"));

    // Handle SPA routing
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../public/index.html'));
    });
  }
}

module.exports = Server;
