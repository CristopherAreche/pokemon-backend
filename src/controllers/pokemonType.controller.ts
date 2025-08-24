import axios from "axios";
import { Type } from "../db";
import { getTypes } from "../services/getTypesFromApi.service";
import { Request, Response } from "express";

export const allTypes = async (req: Request, res: Response) => {
  try {
    const typesFromDb = await Type.findAll();

    if (typesFromDb.length > 0) {
      const types = typesFromDb.map((type: any) => type.name);
      res.status(200).send(types);
    } else {
      const typesFromAPI = await getTypes();
      const types = await Promise.all(
        typesFromAPI.map(async (typeName: string) => {
          const type = await Type.create({ name: typeName });
          return (type as any).name;
        })
      );
      res.status(200).send(types);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send("Internal Server Error");
  }
};
