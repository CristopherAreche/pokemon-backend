import { Router } from "express";
import { allTypes } from "../controllers/pokemonType.controller.supabase";

const pokemonTypeRouter = Router();
pokemonTypeRouter.get("/", allTypes);

export default pokemonTypeRouter;
