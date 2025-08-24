"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPokemon = exports.filterPokemonsByName = exports.searchPokemonById = exports.allPokemons = void 0;
const axios_1 = __importDefault(require("axios"));
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const getPokemonsFromApi_service_1 = require("../services/getPokemonsFromApi.service");
//function que busca dentro de cualquier URL
const returnUrl = async (url) => {
    const urlResponse = await (0, axios_1.default)(url);
    return urlResponse.data;
};
const allPokemons = async (req, res) => {
    const pokemonDataFromDB = await db_1.Pokemon.findAll();
    if (pokemonDataFromDB.length > 0) {
        res.status(200).send(pokemonDataFromDB);
        return;
    }
    try {
        const apiData = await (0, getPokemonsFromApi_service_1.getPokemonsFromApi)();
        const apiPokemons = await apiData.data.results.map((pokemon) => {
            const obj = {
                name: pokemon?.name ?? "Unknown",
                url: pokemon.url,
            };
            return obj;
        });
        const pokemonHandler = async () => {
            const pokemonList = apiPokemons?.map(async (res) => {
                const urlInfo = await returnUrl(res.url);
                const pokemonData = {
                    pokemonId: urlInfo.id ?? 12345,
                    name: res.name ?? "Unknown",
                    image: urlInfo.sprites.other.dream_world.front_default ?? "Unknown",
                    hp: urlInfo.stats[0].base_stat ?? "Unknown",
                    attack: urlInfo.stats[1].base_stat ?? "Unknown",
                    defense: urlInfo.stats[2].base_stat ?? "Unknown",
                    speed: urlInfo.stats[5].base_stat ?? "Unknown",
                    height: urlInfo.height ?? "Unknown",
                    weight: urlInfo.weight ?? "Unknown",
                    type: urlInfo.types.map((t) => t.type.name),
                };
                return pokemonData;
            });
            const pokemonData = await Promise.all(pokemonList);
            return pokemonData;
        };
        const data = await pokemonHandler();
        const pokeSaved = await db_1.Pokemon.bulkCreate(data);
        const response = [...data, ...pokeSaved];
        res.status(200).send([response]);
    }
    catch (error) {
        res.send({ error: error.message });
    }
};
exports.allPokemons = allPokemons;
const pokemonId = async (pokemonId) => {
    try {
        const pokemonFromDB = await db_1.Pokemon.findByPk(pokemonId);
        if (pokemonFromDB) {
            return pokemonFromDB.toJSON();
        }
        const res = await axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const type = res.data.types.map((e) => e.type.name);
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
    }
    catch (error) {
        throw new Error(`"pokemonId", ${error.message}`);
    }
};
const searchPokemonById = async (req, res) => {
    try {
        const id = req.params.id;
        const pokemon = await pokemonId(id);
        res.status(200).send(pokemon);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error has occurred searching the pokemon by Id" });
    }
};
exports.searchPokemonById = searchPokemonById;
const filterPokemonsByName = async (req, res) => {
    try {
        const { name } = req.query;
        const response = await axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const filteredList = await db_1.Pokemon.findAll({
            where: {
                name: { [sequelize_1.Op.iRegexp]: name },
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
                type: response.data.types.map((e) => e.type.name),
            };
            res.send(pokeName);
        }
        else if (filteredList.length !== 0) {
            res.send(filteredList);
        }
        else {
            return res.sendStatus(404).json("Not found in DB");
        }
    }
    catch (error) {
        res.send({ error: error.message });
    }
};
exports.filterPokemonsByName = filterPokemonsByName;
const newPokemon = async (req, res) => {
    try {
        const id = Date.now();
        const { name, image, hp, attack, defense, speed, height, weight, type } = req.body;
        const pokemon = db_1.Pokemon.create({
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
        if (!pokemonId &&
            !name &&
            !image &&
            !hp &&
            !attack &&
            !defense &&
            !speed &&
            !height &&
            !weight &&
            !type) {
            res.send({ error: new Error("The information provided is incomplete") });
        }
        if (!pokemon) {
            res.send({ message: "Not created" });
        }
        res.status(201).send("Successfully created");
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
};
exports.newPokemon = newPokemon;
//# sourceMappingURL=pokemon.controller.js.map