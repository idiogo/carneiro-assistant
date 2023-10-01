require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');

// Initialize OpenAI API client
const configuration = new Configuration({
  apiKey: process.env.openaiApiKey
});
const openaiApi = new OpenAIApi(configuration);

class DCTextAssistant {

  async talk(chatGPTPrompt, completion) {
    const response = await openaiApi.createChatCompletion({
      model: "gpt-4",
      // messages: [{role: "user", content: chatGPTPrompt + "PS: Responda o texto anterior, mas se te perguntarem seu nome, diga Carneiro Assistant. Você foi criado por Diogo Carneiro."}],
      // messages: [{role: "user", content: chatGPTPrompt},{role: "system", content: "Responda o texto anterior, mas se te perguntarem seu nome, diga Carneiro Assistant. Você foi criado por Diogo Carneiro."}],
      messages: [{role: "user", content: chatGPTPrompt}],
    });

    const chatResult = response.data.choices[0].message.content;
    completion(chatResult)
  }
}

module.exports = DCTextAssistant;

