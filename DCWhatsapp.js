require('dotenv').config()
const axios = require('axios');
var fs = require('fs')

class DCWhatsapp {
    async sendText(to, text, completion){
        text = text.toString();
        const response = await axios.post(
            'https://graph.facebook.com/v18.0/' + process.env.whatsappFromNumber + '/messages',
            
            {
                'messaging_product': 'whatsapp',
                'recipient_type': 'individual',
                'to': to,
                'type': 'text',
                'text': {
                'preview_url': false,
                'body': text
                }
            },
            {
                headers: {
                'Authorization': 'Bearer ' + process.env.whatsappAPIToken,
                'Content-Type': 'application/json'
                }
            }
            );
        completion();
    }

    async downloadAudioMedia(toNumber, mediaId, completion){
        this.getAudioMediaURL(mediaId, (response) => {
            console.log(response);
            console.log('111111');
            this.downloadFile(response, 'audios/' + toNumber, (fileName) => {
                console.log('333333');
               setTimeout(() => {
                completion(fileName); 
                },2500);   
            });
        });
    }

    async getAudioMediaURL(mediaId, completion){
        const response = await axios.get('https://graph.facebook.com/v18.0/' + mediaId + '/', {
            headers: {
                'Authorization': 'Bearer ' + process.env.whatsappAPIToken,
            }
        });
        completion(response.data.url);
    }

    
    async downloadFile(fileUrl, outputLocationPath, completion) {
        try {
        // Fetch the audio data from the external URL with the auth token
        const audioResponse = await axios.get(fileUrl, {
            responseType: 'stream',
            headers: {
            Authorization: `Bearer ${process.env.whatsappAPIToken}`,
            }
        });
    
        // Set appropriate headers for streaming audio
        let fileName = outputLocationPath + '_' + Date.now().toString() + ".ogg";
        // Pipe the audio stream from the external response to the current response
        audioResponse.data.pipe(fs.createWriteStream(fileName));
        console.log('222222');
        completion(fileName);
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = DCWhatsapp;