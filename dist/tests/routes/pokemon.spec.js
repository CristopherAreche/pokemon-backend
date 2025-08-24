"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_session_1 = __importDefault(require("supertest-session"));
const app_1 = __importDefault(require("../../src/app"));
const db_1 = require("../../src/db");
const agent = (0, supertest_session_1.default)(app_1.default);
const pokemon = {
    name: 'Pikachu',
};
describe('Pokemon routes', () => {
    before(() => db_1.conn.authenticate()
        .catch((err) => {
        console.error('Unable to connect to the database:', err);
    }));
    beforeEach(() => db_1.Pokemon.sync({ force: true })
        .then(() => db_1.Pokemon.create(pokemon)));
    describe('GET /pokemons', () => {
        it('should get 200', () => agent.get('/pokemons').expect(200));
    });
});
//# sourceMappingURL=pokemon.spec.js.map