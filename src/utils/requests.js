const axios = require("axios");

export const searchTwitter = async (query, nextToken = null) => {
  const response = await axios.get(
    `http://localhost:6900/api?query=${query}${
      nextToken ? `&nextToken=${nextToken}` : ""
    }`
  );
  return response.data;
};
