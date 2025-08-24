"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypes = void 0;
const axios_1 = __importDefault(require("axios"));
const { TYPE_API } = process.env;
const getTypes = async () => {
    try {
        const apiUrl = TYPE_API || "https://pokeapi.co/api/v2/type";
        const response = await axios_1.default.get(apiUrl);
        const types = response.data.results.map((type) => type.name);
        return types;
    }
    catch (error) {
        throw new Error("Error to obtain pokemon types from api.");
    }
};
exports.getTypes = getTypes;
//# sourceMappingURL=getTypesFromApi.service.js.map