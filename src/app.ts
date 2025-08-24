import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import pokemonRouter from "./routes/pokemonRouter";
import pokemonTypeRouter from "./routes/pokemonTypeRouter";

const server = express();

server.use(cors({ origin: "*", methods: ["GET", "POST"] }));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

//Routers
server.use("/pokemons", pokemonRouter);
server.use("/types", pokemonTypeRouter);
server.use(express.static("src"));

// Error catching endware.
server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

export default server;
