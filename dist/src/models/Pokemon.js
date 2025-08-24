"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    return sequelize.define("pokemon", {
        pokemonId: {
            primaryKey: true,
            type: sequelize_1.DataTypes.BIGINT,
            allowNull: false,
            unique: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        hp: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        attack: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        defense: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        speed: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        height: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        weight: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        type: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: true,
        },
    }, {
        createdAt: false,
        updatedAt: false,
        timestamps: false,
    });
};
//# sourceMappingURL=Pokemon.js.map