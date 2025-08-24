"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Pokemon = exports.conn = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const { DATABASE_URL, DB_USER, DB_NAME, DB_PASSWORD, DB_HOST } = process.env;
// Initialize Sequelize with Supabase or local configuration
let sequelize;
if (DATABASE_URL) {
    // Supabase/Production configuration
    sequelize = new sequelize_1.Sequelize(DATABASE_URL, {
        dialect: "postgres",
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
}
else {
    // Local development configuration
    sequelize = new sequelize_1.Sequelize(DB_NAME || "pokemon", DB_USER || "postgres", DB_PASSWORD || "971215", {
        host: DB_HOST || "localhost",
        dialect: "postgres",
        logging: false,
        port: 5432,
    });
}
const basename = path_1.default.basename(__filename);
const modelDefiners = [];
// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs_1.default.readdirSync(path_1.default.join(__dirname, "/models"))
    .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts")
    .forEach((file) => {
    const modelModule = require(path_1.default.join(__dirname, "/models", file));
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
sequelize.models = Object.fromEntries(capsEntries);
const models = sequelize.models;
const { Pokemon, Type } = models;
exports.Pokemon = Pokemon;
exports.Type = Type;
Pokemon.belongsToMany(Type, { through: "pokemonType" });
Type.belongsToMany(Pokemon, { through: "pokemonType" });
exports.conn = sequelize;
exports.default = {
    ...sequelize.models,
    conn: sequelize,
};
//# sourceMappingURL=db.js.map