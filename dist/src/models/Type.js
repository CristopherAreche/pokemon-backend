"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    return sequelize.define("type", {
        id: {
            type: sequelize_1.DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        createdAt: false,
        updatedAt: false,
    });
};
//# sourceMappingURL=Type.js.map