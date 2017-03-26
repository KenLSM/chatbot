var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// Process application/json
app.use(bodyParser.json());

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
});

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
});

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'Generic') {
                sendGenericMessage(sender);
                continue;
            }
            // sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
            sendTextMessage(sender, "Hi Ken!");
            sendTextMessage(sender, "What would you like to do today?");
            sendCard1(sender);
        }
    }
    res.sendStatus(200);
});

function sendCard1(sender) {
 messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "list",
                "elements": [
                    {
                        "title": "Learn",
                        "subtitle": "Learn more about our 4-step technique to prevent scams!",
                        "image_url": "https://image.flaticon.com/icons/svg/43/43254.svg",
                        "buttons": [{
                            "type": "postback",
                            "messenger_extensions": true,
                            "webview_height_ratio": "tall",
                            "payload": "Learn",
                        }],
                    }, {
                        "title": "Evaluate",
                        "subtitle": "Have a scenario that you think you are in?",
                        "image_url": "https://image.flaticon.com/icons/svg/43/43732.svg",
                        "buttons": [{
                            "type": "postback",
                            "messenger_extensions": true,
                            "webview_height_ratio": "tall",
                            "payload": "Evalute",
                        }],
                    }, {
                        "title": "Ask",
                        "subtitle": "Have a question that you want to search?",
                        "image_url": "https://image.flaticon.com/icons/svg/57/57253.svg",
                        "buttons": [{
                            "type": "postback",
                            "messenger_extensions": true,
                            "webview_height_ratio": "tall",
                            "payload": "Ask",
                        }],
                    }
                ]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })   
};

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
};

var token = "EAARSvZC93NMABAPZCoTFIe5py33PyLdtJkYTn6QZB5ITraMVHO7Qv8R3bPnULNZAcmqKuOLzxCZCrzg36JfcwbqUN65Hdg3D71h3oNgvYPpRpbW0Hs2uiHaZBQbIJD4ZAn674tm5aQis4qES8yileuIrNnvqDonTO3MLzX9lIhfzgZDZD";

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};