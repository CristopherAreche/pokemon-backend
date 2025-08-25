"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPokemon = exports.filterPokemonsByName = exports.searchPokemonById = exports.allPokemons = void 0;
const axios_1 = __importDefault(require("axios"));
const supabase_js_1 = require("@supabase/supabase-js");
const getPokemonsFromApi_service_1 = require("../services/getPokemonsFromApi.service");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
const returnUrl = async (url) => {
    const urlResponse = await (0, axios_1.default)(url);
    return urlResponse.data;
};
const allPokemons = async (req, res) => {
    try {
        // Check if we already have Pokemon in the database
        const { data: existingPokemons, error: fetchError } = await supabase
            .from('pokemons')
            .select('*');
        if (fetchError) {
            throw fetchError;
        }
        if (existingPokemons && existingPokemons.length > 0) {
            res.status(200).json(existingPokemons);
            return;
        }
        // If no Pokemon in database, fetch from API
        console.log('No Pokemon found, fetching from API...');
        const apiData = await (0, getPokemonsFromApi_service_1.getPokemonsFromApi)();
        const apiPokemons = apiData.data.results.map((pokemon) => ({
            name: pokemon?.name ?? "Unknown",
            url: pokemon.url,
        }));
        const pokemonList = await Promise.all(apiPokemons.slice(0, 20).map(async (pokemon) => {
            try {
                const urlInfo = await returnUrl(pokemon.url);
                const pokemonData = {
                    pokemonId: urlInfo.id,
                    name: pokemon.name,
                    image: urlInfo.sprites?.other?.['official-artwork']?.front_default ||
                        urlInfo.sprites?.other?.home?.front_default ||
                        urlInfo.sprites?.other?.dream_world?.front_default ||
                        urlInfo.sprites?.front_default ||
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${urlInfo.id}.png`,
                    hp: urlInfo.stats[0]?.base_stat || 0,
                    attack: urlInfo.stats[1]?.base_stat || 0,
                    defense: urlInfo.stats[2]?.base_stat || 0,
                    speed: urlInfo.stats[5]?.base_stat || 0,
                    height: urlInfo.height || 0,
                    weight: urlInfo.weight || 0,
                    type: urlInfo.types.map((t) => t.type.name),
                };
                return pokemonData;
            }
            catch (error) {
                console.error(`Error fetching Pokemon ${pokemon.name}:`, error);
                return null;
            }
        }));
        const validPokemons = pokemonList.filter(p => p !== null);
        // Insert into Supabase
        const { data: insertedPokemons, error: insertError } = await supabase
            .from('pokemons')
            .insert(validPokemons)
            .select();
        if (insertError) {
            console.error('Insert error:', insertError);
            res.status(200).json(validPokemons); // Return data even if insert fails
            return;
        }
        res.status(200).json(insertedPokemons);
    }
    catch (error) {
        console.error('Error in allPokemons:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.allPokemons = allPokemons;
const searchPokemonById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // First check database
        const { data: pokemonFromDB, error: dbError } = await supabase
            .from('pokemons')
            .select('*')
            .eq('pokemonId', id)
            .single();
        if (!dbError && pokemonFromDB) {
            res.status(200).json(pokemonFromDB);
            return;
        }
        // If not in database, fetch from API
        const response = await axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const apiData = response.data;
        const pokemon = {
            pokemonId: apiData.id,
            name: apiData.name,
            image: apiData.sprites?.other?.['official-artwork']?.front_default ||
                apiData.sprites?.other?.home?.front_default ||
                apiData.sprites?.other?.dream_world?.front_default ||
                apiData.sprites?.front_default ||
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${apiData.id}.png`,
            hp: apiData.stats[0]?.base_stat || 0,
            attack: apiData.stats[1]?.base_stat || 0,
            defense: apiData.stats[2]?.base_stat || 0,
            speed: apiData.stats[5]?.base_stat || 0,
            height: apiData.height || 0,
            weight: apiData.weight || 0,
            type: apiData.types.map((t) => t.type.name),
        };
        res.status(200).json(pokemon);
    }
    catch (error) {
        console.error('Error searching Pokemon by ID:', error);
        res.status(500).json({ error: "Pokemon not found" });
    }
};
exports.searchPokemonById = searchPokemonById;
const filterPokemonsByName = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            res.status(400).json({ error: "Name parameter is required" });
            return;
        }
        // Search in database first
        const { data: dbResults, error: dbError } = await supabase
            .from('pokemons')
            .select('*')
            .ilike('name', `%${name}%`);
        if (!dbError && dbResults && dbResults.length > 0) {
            res.status(200).json(dbResults);
            return;
        }
        // If not found in database, try API
        try {
            const response = await axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const apiData = response.data;
            const pokemon = {
                pokemonId: apiData.id,
                name: apiData.name,
                image: apiData.sprites?.other?.['official-artwork']?.front_default ||
                    apiData.sprites?.other?.home?.front_default ||
                    apiData.sprites?.other?.dream_world?.front_default ||
                    apiData.sprites?.front_default ||
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${apiData.id}.png`,
                hp: apiData.stats[0]?.base_stat || 0,
                attack: apiData.stats[1]?.base_stat || 0,
                defense: apiData.stats[2]?.base_stat || 0,
                speed: apiData.stats[5]?.base_stat || 0,
                height: apiData.height || 0,
                weight: apiData.weight || 0,
                type: apiData.types.map((t) => t.type.name),
            };
            res.status(200).json([pokemon]);
        }
        catch (apiError) {
            res.status(404).json({ error: "Pokemon not found" });
        }
    }
    catch (error) {
        console.error('Error filtering Pokemon:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.filterPokemonsByName = filterPokemonsByName;
const newPokemon = async (req, res) => {
    try {
        const { name, image, hp, attack, defense, speed, height, weight, type } = req.body;
        const pokemonId = Date.now(); // Simple ID generation
        const pokemon = {
            pokemonId,
            name,
            image: image || null,
            hp: parseInt(hp) || 0,
            attack: parseInt(attack) || 0,
            defense: parseInt(defense) || 0,
            speed: parseInt(speed) || 0,
            height: parseInt(height) || 0,
            weight: parseInt(weight) || 0,
            type: Array.isArray(type) ? type : [type],
        };
        const { data, error } = await supabase
            .from('pokemons')
            .insert(pokemon)
            .select()
            .single();
        if (error) {
            throw error;
        }
        res.status(201).json({ message: "Pokemon created successfully", pokemon: data });
    }
    catch (error) {
        console.error('Error creating Pokemon:', error);
        res.status(400).json({ error: error.message });
    }
};
exports.newPokemon = newPokemon;
//# sourceMappingURL=pokemon.controller.supabase.js.map