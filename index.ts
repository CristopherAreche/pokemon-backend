import server from "./src/app";

// Start server directly (no database sync needed for Supabase)
const port = process.env.PORT || 3005;

server.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
  console.log(`🔗 Environment: Supabase Production`);
  console.log(`📊 API Base URL: http://localhost:${port}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /pokemons - Get all Pokemon`);
  console.log(`   GET  /pokemons/:id - Get Pokemon by ID`);
  console.log(`   GET  /pokemons/search?name=pikachu - Search Pokemon`);
  console.log(`   POST /pokemons - Create new Pokemon`);
  console.log(`   GET  /types - Get all types`);
});
