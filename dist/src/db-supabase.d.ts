export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
export declare const initializeTables: () => Promise<boolean>;
export declare const PokemonDB: {
    findAll(): Promise<any[]>;
    findByPk(id: number): Promise<any>;
    bulkCreate(pokemons: any[]): Promise<any[]>;
    create(pokemon: any): Promise<any>;
    findAll_with_filter(filter: any): Promise<any[]>;
};
export declare const TypeDB: {
    findAll(): Promise<any[]>;
    create(typeData: any): Promise<any>;
};
declare const _default: {
    supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
    initializeTables: () => Promise<boolean>;
    PokemonDB: {
        findAll(): Promise<any[]>;
        findByPk(id: number): Promise<any>;
        bulkCreate(pokemons: any[]): Promise<any[]>;
        create(pokemon: any): Promise<any>;
        findAll_with_filter(filter: any): Promise<any[]>;
    };
    TypeDB: {
        findAll(): Promise<any[]>;
        create(typeData: any): Promise<any>;
    };
};
export default _default;
//# sourceMappingURL=db-supabase.d.ts.map