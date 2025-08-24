"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPokemonsFromApi = void 0;
const axios_1 = __importDefault(require("axios"));
const getPokemonsFromApi = async () => {
    const pokemonData = await axios_1.default.get(`https://pokeapi.co/api/v2/pokemon?limit=150`);
    return pokemonData;
};
exports.getPokemonsFromApi = getPokemonsFromApi;
//# sourceMappingURL=getPokemonsFromApi.service.js.map