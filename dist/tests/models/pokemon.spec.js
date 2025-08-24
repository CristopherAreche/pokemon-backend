"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../src/db");
describe('Pokemon model', () => {
    before(() => db_1.conn.authenticate()
        .catch((err) => {
        console.error('Unable to connect to the database:', err);
    }));
    describe('Validators', () => {
        beforeEach(() => db_1.Pokemon.sync({ force: true }));
        describe('name', () => {
            it('should throw an error if name is null', (done) => {
                db_1.Pokemon.create({})
                    .then(() => done(new Error('It requires a valid name')))
                    .catch(() => done());
            });
            it('should work when its a valid name', () => {
                db_1.Pokemon.create({ name: 'Pikachu' });
            });
        });
    });
});
//# sourceMappingURL=pokemon.spec.js.map