const OpenAI = require('openai');
require('dotenv').config({ path: '../../../.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

let completionTokens = 0;
let promptTokens = 0;

function relaxedJSONParse(jsonString) {
    let objects = [];
    let depth = 0;
    let currentObject = '';
    let inString = false;
    let escape = false;

    for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString[i];

        if (char === '"' && !escape) {
            inString = !inString;
        }

        if (inString) {
            currentObject += char;
            escape = char === '\\' && !escape;
            continue;
        }

        if (char === '{') {
            depth++;
        } else if (char === '}') {
            depth--;
        }

        currentObject += char;

        if (depth === 0 && char === '}') {
            try {
                objects.push(JSON.parse(currentObject));
            } catch (e) {
                console.error("Invalid JSON object skipped:", currentObject, e.message);
            }
            currentObject = '';
        }
    }

    return objects;
}

async function gpt(prompt, model, temperature = 0.7, n = 1, maxTokens = 4000, stop = null) {
    if (model === 'gpt-4') {
        model = 'gpt-4-1106-preview';
    }
    return chatgpt(prompt, model, temperature, maxTokens, n, stop);
}

async function chatgpt(prompt, model, temperature, maxTokens, n, stop) {
    let outputs = [];
    while (n > 0) {
        const cnt = Math.min(n, 20);
        n -= cnt;

        console.log(prompt);
        console.log("maxTokens: ", maxTokens);
        console.log("temperature: ", temperature);
        console.log("n: ", cnt);
        console.log("stop: ", stop);
        console.log("model: ", model);
        const response = await openai.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: prompt }],
            temperature: temperature,
            max_tokens: maxTokens,
            n: cnt,
            stop: stop
        });

        console.log(response.choices);
        console.log("End of response");

        response.choices.forEach(choice => {
            let content = choice.message.content;
            content = content.replace(/```json/g, "").replace(/```/g, "").trim();
        
            const parsedObjects = relaxedJSONParse(content);
        
            const jsonStringifiedObjects = parsedObjects.map(obj => JSON.stringify(obj, null, 2));
            outputs.push(...jsonStringifiedObjects);
        });

        completionTokens += response.usage.completion_tokens;
        promptTokens += response.usage.prompt_tokens;
    }

    return outputs;
}

function gptUsage(backend = 'gpt-4') {
    let cost = 0;
    if (backend === 'gpt-4') {
        cost = completionTokens / 1000 * 0.06 + promptTokens / 1000 * 0.03;
    } else if (backend === 'gpt-3.5-turbo') {
        cost = completionTokens / 1000 * 0.002 + promptTokens / 1000 * 0.0015;
    }
    return { completionTokens, promptTokens, cost };
}

module.exports = {
    gpt,
    gptUsage
};