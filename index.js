const server = require("./src/app.js");
const { conn } = require("./src/db.js");

// Syncing all the models at once.
conn.sync({ alter: true }).then(() => {
  const port = process.env.DB_PORT || 3005;
  server.listen(port, () => {
    console.log(`Listening on port ${port}.`);
  });
});
