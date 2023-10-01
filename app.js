var express = require('express');
var bodyParser = require('body-parser')
var app = express();
const Sussuro = require('./DCSussurro.js');
const DCTextAssistant = require('./DCTextAssistant.js');
const DCWhatsapp = require('./DCWhatsapp.js');
const DCJournal = require('./DCJournal.js');

const assistant = new DCTextAssistant();
const whatsapp = new DCWhatsapp();
const journal = new DCJournal();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    // if (req.query["hub.verify_token"] == "coisocoisado") {
    //     res.send(req.query["hub.challenge"]);
    // }else{
    //     res.send('Error, wrong validation token');
    // }
    res.send("");
});

app.post('/', function (req, res) {
    var body = JSON.parse(JSON.stringify(req.body));
    var messages = body.entry[0].changes[0].value.messages;

    if (typeof messages !== 'undefined' && messages){  
        var toNumber = body.entry[0].changes[0].value.messages[0].from;
        var messageType = body.entry[0].changes[0].value.messages[0].type;

        if (messageType == "text"){
            var message = body.entry[0].changes[0].value.messages[0].text.body;

            console.log(toNumber + ': ' + message);
            journal.insert(toNumber, toNumber + ': ' + message);
    
            assistant.talk(message, (chatResult) => {
    
                console.log('Carneiro Assistant: ' + chatResult);
                journal.insert(toNumber, 'Carneiro Assistant: ' + chatResult, ()=>{
                    journal.insert(toNumber, "\n\n"+ "-".repeat(100) +"\n\n");
                });
    
                whatsapp.sendText(toNumber, ""+chatResult+"", ()=>{
                    console.log('Message sent to ' + toNumber);
                });
            });
        }else if(messageType == "audio"){
            whatsapp.downloadAudioMedia(toNumber, body.entry[0].changes[0].value.messages[0].audio.id, (fileName) => {
                const s = new Sussuro();
                s.transcript(fileName, (transcription) => {
                    console.log(toNumber + ' [AUDIO TRANSCRIPTION (' + fileName + ')] : ' + transcription);
                    journal.insert(toNumber, toNumber + ' [AUDIO TRANSCRIPTION (' + fileName + ')] : ' + transcription);

                    assistant.talk(transcription, (chatResult) => {
                        console.log('Carneiro Assistant: ' + chatResult);
                        journal.insert(toNumber, 'Carneiro Assistant: ' + chatResult, ()=>{
                            journal.insert(toNumber, "\n\n"+ "-".repeat(100) +"\n\n");
                        });
            
                        whatsapp.sendText(toNumber, ""+chatResult+"", ()=>{
                            console.log('Message sent to ' + toNumber);
                        });
                    });
                });
            });
            console.log(messageType);
        }
        
    }

    res.send('');
});

app.listen(3000);
