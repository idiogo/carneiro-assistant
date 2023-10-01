require('dotenv').config()

const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const form = new FormData();

class Sussuro {

  async transcript(audioFile, completion) {

    form.append('file', fs.readFileSync(audioFile), audioFile);
    form.append('model', 'whisper-1');

    const response = await axios.post(
          'https://api.openai.com/v1/audio/transcriptions',
          form,
          {
            headers: {
              ...form.getHeaders(),
              'Authorization': 'Bearer ' + process.env.openaiApiKey,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        completion(response.data.text)
    }
  }
  module.exports = Sussuro;
