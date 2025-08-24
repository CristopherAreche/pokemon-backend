import axios from "axios";
import { Op } from "sequelize";
import { Pokemon } from "../db";
import { getPokemonsFromApi } from "../services/getPokemonsFromApi.service";
import { Request, Response } from "express";
import { PokemonData, ApiPokemonResponse, CreatePokemonBody } from "../types/pokemon.types";

//function que busca dentro de cualquier URL
const returnUrl = async (url: string) => {
  const urlResponse = await axios(url);
  return urlResponse.data;
};

export const allPokemons = async (req: Request, res: Response) => {
  const pokemonDataFromDB = await Pokemon.findAll();
  if (pokemonDataFromDB.length > 0) {
    res.status(200).send(pokemonDataFromDB);
    return;
  }
  try {
    const apiData = await getPokemonsFromApi();
    const apiPokemons = await apiData.data.results.map((pokemon: any) => {
      const obj = {
        name: pokemon?.name ?? "Unknown",
        url: pokemon.url,
      };

      return obj;
    });
    const pokemonHandler = async () => {
      const pokemonList = apiPokemons?.map(async (res: any) => {
        const urlInfo = await returnUrl(res.url);
        const pokemonData: PokemonData = {
          pokemonId: urlInfo.id ?? 12345,
          name: res.name ?? "Unknown",
          image: urlInfo.sprites.other.dream_world.front_default ?? "Unknown",
          hp: urlInfo.stats[0].base_stat ?? "Unknown",
          attack: urlInfo.stats[1].base_stat ?? "Unknown",
          defense: urlInfo.stats[2].base_stat ?? "Unknown",
          speed: urlInfo.stats[5].base_stat ?? "Unknown",
          height: urlInfo.height ?? "Unknown",
          weight: urlInfo.weight ?? "Unknown",
          type: urlInfo.types.map((t: any) => t.type.name),
        };
        return pokemonData;
      });
      const pokemonData = await Promise.all(pokemonList);
      return pokemonData;
    };
    const data = await pokemonHandler();
    const pokeSaved = await Pokemon.bulkCreate(data);
    const response = [...data, ...pokeSaved];
    res.status(200).send([response]);
  } catch (error: any) {
    res.send({ error: error.message });
  }
};

const pokemonId = async (pokemonId: string | number) => {
  try {
    const pokemonFromDB = await Pokemon.findByPk(pokemonId);
    if (pokemonFromDB) {
      return pokemonFromDB.toJSON();
    }
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );
    const type = res.data.types.map((e: any) => e.type.name);
    const pokemon = {
      pokemonId: res.data.id,
      name: res.data.name,
      hp: res.data.stats[0].base_stat,
      speed: res.data.stats[5].base_stat,
      attack: res.data.stats[1].base_stat,
      defense: res.data.stats[2].base_stat,
      weight: res.data.weight,
      height: res.data.height,
      image: res.data.sprites.other.dream_world.front_default,
      type: type,
    };
    return pokemon;
  } catch (error: any) {
    throw new Error(`"pokemonId", ${error.message}`);
  }
};

export const searchPokemonById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const pokemon = await pokemonId(id);
    res.status(200).send(pokemon);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error has occurred searching the pokemon by Id" });
  }
};

export const filterPokemonsByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    const filteredList = await Pokemon.findAll({
      where: {
        name: { [Op.iRegexp]: name },
      },
    });
    if (response) {
      const pokeName = {
        name: response.data.name,
        hp: response.data.stats[0].base_stat,
        speed: response.data.stats[5].base_stat,
        attack: response.data.stats[1].base_stat,
        defense: response.data.stats[2].base_stat,
        weight: response.data.weight,
        height: response.data.height,
        image: response.data.sprites.other.dream_world.front_default,
        type: response.data.types.map((e: any) => e.type.name),
      };
      res.send(pokeName);
    } else if (filteredList.length !== 0) {
      res.send(filteredList);
    } else {
      return res.sendStatus(404).json("Not found in DB");
    }
  } catch (error: any) {
    res.send({ error: error.message });
  }
};

export const newPokemon = async (req: Request, res: Response) => {
  try {
    const id = Date.now();

    const { name, image, hp, attack, defense, speed, height, weight, type } =
      req.body;
    const pokemon = Pokemon.create({
      pokemonId: id,
      name,
      image,
      hp: +hp,
      attack: +attack,
      defense: +defense,
      speed: +speed,
      height: +height,
      weight: +weight,
      type,
    });
    if (
      !pokemonId &&
      !name &&
      !image &&
      !hp &&
      !attack &&
      !defense &&
      !speed &&
      !height &&
      !weight &&
      !type
    ) {
      res.send({ error: new Error("The information provided is incomplete") });
    }
    if (!pokemon) {
      res.send({ message: "Not created" });
    }
    res.status(201).send("Successfully created");
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
};
