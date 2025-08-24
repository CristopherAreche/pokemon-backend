"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allTypes = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const getTypesFromApi_service_1 = require("../services/getTypesFromApi.service");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
const allTypes = async (req, res) => {
    try {
        // First check if we have types in database
        const { data: typesFromDb, error: fetchError } = await supabase
            .from('type')
            .select('*');
        if (fetchError) {
            throw fetchError;
        }
        if (typesFromDb && typesFromDb.length > 0) {
            const typeNames = typesFromDb.map((type) => type.name);
            res.status(200).json(typeNames);
            return;
        }
        // If no types in database, fetch from API and store
        console.log('No types found, fetching from API...');
        const typesFromAPI = await (0, getTypesFromApi_service_1.getTypes)();
        if (typesFromAPI && typesFromAPI.length > 0) {
            // Insert types into database
            const typeObjects = typesFromAPI.map((typeName) => ({ name: typeName }));
            const { data: insertedTypes, error: insertError } = await supabase
                .from('type')
                .insert(typeObjects)
                .select();
            if (insertError) {
                console.error('Error inserting types:', insertError);
                // Return API data even if insert fails
                res.status(200).json(typesFromAPI);
                return;
            }
            const typeNames = insertedTypes.map((type) => type.name);
            res.status(200).json(typeNames);
        }
        else {
            res.status(200).json([]);
        }
    }
    catch (error) {
        console.error('Error in allTypes:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.allTypes = allTypes;
//# sourceMappingURL=pokemonType.controller.supabase.js.map