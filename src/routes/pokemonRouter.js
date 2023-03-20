const axios = require("axios");
const { Router } = require("express");
const {
  allPokemons,
  searchPokemonById,
  filterPokemonsByName,
  newPokemon,
  deletePokemon,
  updatePokemon,
} = require("../controllers/pokemon.controller.js");

const pokemonRouter = Router();

pokemonRouter.get("/", allPokemons);
pokemonRouter.get("/search", filterPokemonsByName);
pokemonRouter.get("/:id", searchPokemonById);
pokemonRouter.post("/", newPokemon);

module.exports = pokemonRouter;
