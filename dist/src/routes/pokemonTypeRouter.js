"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pokemonType_controller_supabase_1 = require("../controllers/pokemonType.controller.supabase");
const pokemonTypeRouter = (0, express_1.Router)();
pokemonTypeRouter.get("/", pokemonType_controller_supabase_1.allTypes);
exports.default = pokemonTypeRouter;
//# sourceMappingURL=pokemonTypeRouter.js.map