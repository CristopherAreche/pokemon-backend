import axios from "axios";
const { TYPE_API } = process.env;

export const getTypes = async () => {
  try {
    const apiUrl = TYPE_API || "https://pokeapi.co/api/v2/type";
    const response = await axios.get(apiUrl);
    const types = response.data.results.map((type: any) => type.name);
    return types;
  } catch (error: any) {
    throw new Error("Error to obtain pokemon types from api.");
  }
};
