// utils.js
const fs = require('fs').promises;
const axios = require('axios');

const fetchData = async (file, url) => {
    try {
        try {
            await fs.access(file);
            const fileData = await fs.readFile(file, 'utf8');
            const jsonData = JSON.parse(fileData);
            return jsonData;
        } catch (fileError) {
            const response = await axios.get(url);
            console.log("Fetched file from URL");
        
            // Convert JSON object to a string
            const result = JSON.stringify(response.data, null, 2); // The null and 2 arguments format the JSON for readability
        
            // Write the JSON string to a file
            await fs.writeFile(file, result, 'utf8');
            console.log("File saved successfully");

            return result;
        }
    } catch (error) {
        throw new Error(`Error in fetchData: ${error.message}`);
    }
};

module.exports = fetchData;
