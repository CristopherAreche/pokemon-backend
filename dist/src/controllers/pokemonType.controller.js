"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTypes = void 0;
const db_1 = require("../db");
const getTypesFromApi_service_1 = require("../services/getTypesFromApi.service");
const allTypes = async (req, res) => {
    try {
        const typesFromDb = await db_1.Type.findAll();
        if (typesFromDb.length > 0) {
            const types = typesFromDb.map((type) => type.name);
            res.status(200).send(types);
        }
        else {
            const typesFromAPI = await (0, getTypesFromApi_service_1.getTypes)();
            const types = await Promise.all(typesFromAPI.map(async (typeName) => {
                const type = await db_1.Type.create({ name: typeName });
                return type.name;
            }));
            res.status(200).send(types);
        }
    }
    catch (error) {
        console.log(error);
        res.status(404).send("Internal Server Error");
    }
};
exports.allTypes = allTypes;
//# sourceMappingURL=pokemonType.controller.js.map