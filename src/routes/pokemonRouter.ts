import { Router } from "express";
import {
  allPokemons,
  searchPokemonById,
  filterPokemonsByName,
  newPokemon,
} from "../controllers/pokemon.controller.supabase";

const pokemonRouter = Router();

pokemonRouter.get("/", allPokemons);
pokemonRouter.get("/search", filterPokemonsByName);
pokemonRouter.get("/:id", searchPokemonById);
pokemonRouter.post("/", newPokemon);

export default pokemonRouter;
