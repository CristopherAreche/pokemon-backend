import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import fs from "fs";
import path from "path";

dotenv.config();
const { DATABASE_URL, DB_USER, DB_NAME, DB_PASSWORD, DB_HOST } = process.env;

// Initialize Sequelize with Supabase or local configuration
let sequelize: Sequelize;

if (DATABASE_URL) {
  // Supabase/Production configuration
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Local development configuration
  sequelize = new Sequelize(
    DB_NAME || "pokemon", 
    DB_USER || "postgres", 
    DB_PASSWORD || "971215", {
    host: DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
    port: 5432,
  });
}

const basename = path.basename(__filename);

const modelDefiners: any[] = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
  )
  .forEach((file) => {
    const modelModule = require(path.join(__dirname, "/models", file));
    const model = modelModule.default || modelModule;
    modelDefiners.push(model);
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
(sequelize as any).models = Object.fromEntries(capsEntries);

const models = sequelize.models;
const { Pokemon, Type } = models;

Pokemon.belongsToMany(Type, { through: "pokemonType" });
Type.belongsToMany(Pokemon, { through: "pokemonType" });

export const conn = sequelize;
export { Pokemon, Type };
export default {
  ...sequelize.models,
  conn: sequelize,
};
