"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pokemon_controller_supabase_1 = require("../controllers/pokemon.controller.supabase");
const pokemonRouter = (0, express_1.Router)();
pokemonRouter.get("/", pokemon_controller_supabase_1.allPokemons);
pokemonRouter.get("/search", pokemon_controller_supabase_1.filterPokemonsByName);
pokemonRouter.get("/:id", pokemon_controller_supabase_1.searchPokemonById);
pokemonRouter.post("/", pokemon_controller_supabase_1.newPokemon);
exports.default = pokemonRouter;
//# sourceMappingURL=pokemonRouter.js.map