import { Request, Response } from "express";
import { createClient } from '@supabase/supabase-js';
import { getTypes } from "../services/getTypesFromApi.service";
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const allTypes = async (req: Request, res: Response) => {
  try {
    // First check if we have types in database
    const { data: typesFromDb, error: fetchError } = await supabase
      .from('type')
      .select('*');

    if (fetchError) {
      throw fetchError;
    }

    if (typesFromDb && typesFromDb.length > 0) {
      const typeNames = typesFromDb.map((type: any) => type.name);
      res.status(200).json(typeNames);
      return;
    }

    // If no types in database, fetch from API and store
    console.log('No types found, fetching from API...');
    const typesFromAPI = await getTypes();
    
    if (typesFromAPI && typesFromAPI.length > 0) {
      // Insert types into database
      const typeObjects = typesFromAPI.map((typeName: string) => ({ name: typeName }));
      
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

      const typeNames = insertedTypes.map((type: any) => type.name);
      res.status(200).json(typeNames);
    } else {
      res.status(200).json([]);
    }
  } catch (error: any) {
    console.error('Error in allTypes:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};