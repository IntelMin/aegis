// utils.js
const fs = require("fs").promises;
const axios = require("axios");
const path = require("path");

const fetchData = async (file, url) => {
  try {
    try {
      await fs.access(file);
      const fileData = await fs.readFile(file, "utf8");
      const jsonData = JSON.parse(fileData);
      return jsonData;
    } catch (fileError) {
      const response = await axios.get(url);
      console.log("Fetched file from URL");

      // Convert JSON object to a string
      const result = JSON.stringify(response.data, null, 2); // The null and 2 arguments format the JSON for readability

      // Write the JSON string to a file
      await fs.writeFile(file, result, "utf8");
      console.log("File saved successfully");

      return result;
    }
  } catch (error) {
    throw new Error(`Error in fetchData: ${error.message}`);
  }
};

const readCache = async (filename) => {
  try {
    let data = await fs.readFile(filename, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or there is an error, return null
    return null;
  }
};

const writeCache = async (filename, data) => {
  const dir = path.dirname(filename);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filename, JSON.stringify(data), "utf8");
};

const getCachedOrFreshData = async (
  cacheFilename,
  dataFunction,
  ...dataArgs
) => {
  // Check if the cached file exists
  console.log("--- cacheFilename: ", cacheFilename);
  let cachedData = await readCache(cacheFilename);
  if (cachedData !== null) {
    // If cache is available, return it
    return cachedData;
  } else {
    // Otherwise, get fresh data, save to cache, and return it
    let freshData = await dataFunction(...dataArgs);
    await writeCache(cacheFilename, freshData);
    return freshData;
  }
};

module.exports = { getCachedOrFreshData, readCache, writeCache, fetchData };
