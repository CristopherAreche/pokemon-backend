"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const pokemonRouter_1 = __importDefault(require("./routes/pokemonRouter"));
const pokemonTypeRouter_1 = __importDefault(require("./routes/pokemonTypeRouter"));
const server = (0, express_1.default)();
server.use((0, cors_1.default)({ origin: "*", methods: ["GET", "POST"] }));
server.use(body_parser_1.default.urlencoded({ extended: true, limit: "50mb" }));
server.use(body_parser_1.default.json({ limit: "50mb" }));
server.use((0, cookie_parser_1.default)());
server.use((0, morgan_1.default)("dev"));
//Routers
server.use("/pokemons", pokemonRouter_1.default);
server.use("/types", pokemonTypeRouter_1.default);
server.use(express_1.default.static("src"));
// Error catching endware.
server.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
});
exports.default = server;
//# sourceMappingURL=app.js.map