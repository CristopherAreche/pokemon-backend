import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Initialize database tables
export const initializeTables = async () => {
  try {
    console.log('Initializing Supabase tables...');
    
    // Create Pokemon table
    const { error: pokemonError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS pokemon (
          "pokemonId" BIGINT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          image VARCHAR(255),
          hp INTEGER,
          attack INTEGER,
          defense INTEGER,
          speed INTEGER,
          height INTEGER,
          weight INTEGER,
          type TEXT[]
        );
      `
    });

    if (pokemonError) console.log('Pokemon table:', pokemonError.message);

    // Create Type table
    const { error: typeError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS type (
          id BIGSERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE
        );
      `
    });

    if (typeError) console.log('Type table:', typeError.message);

    // Create junction table
    const { error: junctionError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS "pokemonType" (
          "pokemonId" BIGINT REFERENCES pokemon("pokemonId"),
          "typeId" BIGINT REFERENCES type(id),
          PRIMARY KEY ("pokemonId", "typeId")
        );
      `
    });

    if (junctionError) console.log('Junction table:', junctionError.message);

    console.log('Tables initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing tables:', error);
    return false;
  }
};

// Pokemon operations
export const PokemonDB = {
  async findAll() {
    const { data, error } = await supabase.from('pokemon').select('*');
    if (error) throw error;
    return data;
  },

  async findByPk(id: number) {
    const { data, error } = await supabase.from('pokemon').select('*').eq('pokemonId', id).single();
    if (error) throw error;
    return data;
  },

  async bulkCreate(pokemons: any[]) {
    const { data, error } = await supabase.from('pokemon').insert(pokemons).select();
    if (error) throw error;
    return data;
  },

  async create(pokemon: any) {
    const { data, error } = await supabase.from('pokemon').insert(pokemon).select().single();
    if (error) throw error;
    return data;
  },

  async findAll_with_filter(filter: any) {
    let query = supabase.from('pokemon').select('*');
    
    if (filter.name) {
      query = query.ilike('name', `%${filter.name}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
};

// Type operations
export const TypeDB = {
  async findAll() {
    const { data, error } = await supabase.from('type').select('*');
    if (error) throw error;
    return data;
  },

  async create(typeData: any) {
    const { data, error } = await supabase.from('type').insert(typeData).select().single();
    if (error) throw error;
    return data;
  }
};

export default { supabase, initializeTables, PokemonDB, TypeDB };