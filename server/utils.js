// utils.js
const fs = require("fs").promises;
const axios = require("axios");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);
async function isContractOpenSource(address) {
  const apiKey = 'EYEC357Q2UY267KX88U25HZ57KIPNT4CYB'; // Replace with your Etherscan API key
  const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;

  const response = await axios.get(url);
  const data = response.data;

  // If the contract is open source, the sourceCode field will not be empty
  return data.result[0].SourceCode !== '';
}
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

// Function to insert data into a Supabase table
async function insertData(data) {
  try {
    const { data: insertedData, error } = await supabase
      .from("audit-requests")
      .insert(data);

    if (error) {
      throw new Error(error.message);
    }

    return insertedData;
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
}
async function modifyRow(address, newStatus) {
  try {
    const { data: updatedData, error } = await supabase
      .from("audit-requests")
      .update({ status: newStatus })
      .eq("address", address);

    if (error) {
      throw new Error(error.message);
    }

    return updatedData;
  } catch (error) {
    console.error("Error modifying row:", error);}}

module.exports = { getCachedOrFreshData, readCache, writeCache, fetchData,isContractOpenSource,insertData,modifyRow };
