const express = require("express");
const cors = require("cors");
const { db } = require("../database/db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //Aca van los Path Routes

    //Conexion a la DB
    this.database();

    //Aca van los Middlewares
    this.middlewares();

    //Aca van los Routes
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {}

  database() {
    db.authenticate()
      .then(() => console.log("Database authenticated"))
      .catch((err) => console.log(err));

    //Relaciones

    db.sync()
      .then(() => console.log("Database Synced"))
      .catch((err) => console.log(err));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server Running On Port", this.port);
    });
  }
}

module.exports = Server;
