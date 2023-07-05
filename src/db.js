require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_NAME, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  `postgres://pokemon_db_j70b_user:VEgJCEl245aqj0U9HSZN66qP6XVhY2yB@dpg-ciido9t9aq012eqrdi5g-a.oregon-postgres.render.com/pokemon_db_j70b?ssl=true`
);

//LOCAL TEST
// const sequelize = new Sequelize("pokemon", "postgres", "971215", {
//   host: "localhost",
//   dialect: "postgres",
//   logging: false,
//   port: 5432,
// });

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Pokemon, Type } = sequelize.models;

Pokemon.belongsToMany(Type, { through: "pokemonType" });
Type.belongsToMany(Pokemon, { through: "pokemonType" });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
