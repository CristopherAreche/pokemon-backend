import axios from "axios";

export const getPokemonsFromApi = async () => {
  const pokemonData = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?limit=150`
  );
  return pokemonData;
};
