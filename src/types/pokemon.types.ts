export interface PokemonData {
  pokemonId: number;
  name: string;
  image?: string;
  hp?: number;
  attack?: number;
  defense?: number;
  speed?: number;
  height?: number;
  weight?: number;
  type?: string[];
}

export interface ApiPokemonResponse {
  id: number;
  name: string;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
  stats: Array<{
    base_stat: number;
  }>;
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
}

export interface ApiTypeResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface CreatePokemonBody {
  name: string;
  image?: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  type: string[];
}