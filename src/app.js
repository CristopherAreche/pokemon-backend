const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const pokemonRouter = require("./routes/pokemonRouter.js");
const pokemonTypeRouter = require("./routes/pokemonTypeRouter.js");

require("./db.js");

const server = express();

server.name = "API";

server.use(cors({ origin: "*", methods: ["GET", "POST"] }));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

//Routers
server.use("/pokemons", pokemonRouter);
server.use("/types", pokemonTypeRouter);
server.use(express("src"));

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
