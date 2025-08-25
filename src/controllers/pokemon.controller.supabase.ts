import axios from "axios";
import { Request, Response } from "express";
import { createClient } from '@supabase/supabase-js';
import { PokemonData, ApiPokemonResponse } from "../types/pokemon.types";
import { getPokemonsFromApi } from "../services/getPokemonsFromApi.service";
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const returnUrl = async (url: string): Promise<ApiPokemonResponse> => {
  const urlResponse = await axios(url);
  return urlResponse.data;
};

export const allPokemons = async (req: Request, res: Response) => {
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
    const apiData = await getPokemonsFromApi();
    const apiPokemons = apiData.data.results.map((pokemon: any) => ({
      name: pokemon?.name ?? "Unknown",
      url: pokemon.url,
    }));

    const pokemonList = await Promise.all(
      apiPokemons.slice(0, 20).map(async (pokemon: any) => { // Limit to first 20 for testing
        try {
          const urlInfo = await returnUrl(pokemon.url);
          const pokemonData: PokemonData = {
            pokemonId: urlInfo.id,
            name: pokemon.name,
            image: (urlInfo.sprites as any)?.other?.['official-artwork']?.front_default || 
                   (urlInfo.sprites as any)?.other?.home?.front_default || 
                   urlInfo.sprites?.other?.dream_world?.front_default || 
                   (urlInfo.sprites as any)?.front_default ||
                   `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${urlInfo.id}.png`,
            hp: urlInfo.stats[0]?.base_stat || 0,
            attack: urlInfo.stats[1]?.base_stat || 0,
            defense: urlInfo.stats[2]?.base_stat || 0,
            speed: urlInfo.stats[5]?.base_stat || 0,
            height: urlInfo.height || 0,
            weight: urlInfo.weight || 0,
            type: urlInfo.types.map((t: any) => t.type.name),
          };
          return pokemonData;
        } catch (error) {
          console.error(`Error fetching Pokemon ${pokemon.name}:`, error);
          return null;
        }
      })
    );

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
  } catch (error: any) {
    console.error('Error in allPokemons:', error);
    res.status(500).json({ error: error.message });
  }
};

export const searchPokemonById = async (req: Request, res: Response) => {
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
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const apiData = response.data;
    
    const pokemon = {
      pokemonId: apiData.id,
      name: apiData.name,
      image: (apiData.sprites as any)?.other?.['official-artwork']?.front_default || 
             (apiData.sprites as any)?.other?.home?.front_default || 
             apiData.sprites?.other?.dream_world?.front_default || 
             (apiData.sprites as any)?.front_default ||
             `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${apiData.id}.png`,
      hp: apiData.stats[0]?.base_stat || 0,
      attack: apiData.stats[1]?.base_stat || 0,
      defense: apiData.stats[2]?.base_stat || 0,
      speed: apiData.stats[5]?.base_stat || 0,
      height: apiData.height || 0,
      weight: apiData.weight || 0,
      type: apiData.types.map((t: any) => t.type.name),
    };

    res.status(200).json(pokemon);
  } catch (error: any) {
    console.error('Error searching Pokemon by ID:', error);
    res.status(500).json({ error: "Pokemon not found" });
  }
};

export const filterPokemonsByName = async (req: Request, res: Response) => {
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
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const apiData = response.data;
      
      const pokemon = {
        pokemonId: apiData.id,
        name: apiData.name,
        image: (apiData.sprites as any)?.other?.['official-artwork']?.front_default || 
             (apiData.sprites as any)?.other?.home?.front_default || 
             apiData.sprites?.other?.dream_world?.front_default || 
             (apiData.sprites as any)?.front_default ||
             `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${apiData.id}.png`,
        hp: apiData.stats[0]?.base_stat || 0,
        attack: apiData.stats[1]?.base_stat || 0,
        defense: apiData.stats[2]?.base_stat || 0,
        speed: apiData.stats[5]?.base_stat || 0,
        height: apiData.height || 0,
        weight: apiData.weight || 0,
        type: apiData.types.map((t: any) => t.type.name),
      };

      res.status(200).json([pokemon]);
    } catch (apiError) {
      res.status(404).json({ error: "Pokemon not found" });
    }
  } catch (error: any) {
    console.error('Error filtering Pokemon:', error);
    res.status(500).json({ error: error.message });
  }
};

export const newPokemon = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error('Error creating Pokemon:', error);
    res.status(400).json({ error: error.message });
  }
};