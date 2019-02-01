// TODO: encrypt app to run HTTPS locally, check:
// https://github.com/botmasterai/botmaster-socket.io/issues/2#issuecomment-303785233
// https://www.sitepoint.com/how-to-use-ssltls-with-node-js/

// Load enviroment variables from file ".env"
const dotenv = require('dotenv').config();


/////////////////////////////////////////////////////
/// Express server for Frontend app - START
/////////////////////////////////////////////////////

// TODO: Refractor the frontend app in a separate file/folder

const express = require('express');

const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";
const app = express();

// Routing for ./public/index.html
app.use(express.static(__dirname + '/public'));

const server = app.listen(port, host, () => {
  console.log('Server listening at http://%s:%d', host, port);
});

/////////////////////////////////////////////////////
/// Express server for Frontend app - END
/////////////////////////////////////////////////////


/////////////////////////////////////////////////////
/// Botmaster Backend
/////////////////////////////////////////////////////

const Botmaster = require('botmaster');

// Adding a new Botmaster
const botmaster = new Botmaster({
  server
});


/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/// Bot platforms - START
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

/////////////////////////////////////////////////////
/// Bot platform: SocketIo
/////////////////////////////////////////////////////

// Using this socket.io bot class for the sake of the example
const SocketioBot = require('botmaster-socket.io');

// Adding a SocketIo to botmaster
botmaster.addBot(new SocketioBot({
  id: 'SOCKETIO_BOT_ID', //TOTO: change id
  // server: botmaster.server, // this is required for socket.io. You can set it to another node server object if you wish to. But in this example, we will use the one created by botmaster under the hood
  server: server
}));


/////////////////////////////////////////////////////
/// Bot platform: Facebook Messenger
/////////////////////////////////////////////////////

const MessengerBot = require('botmaster-messenger');

const messengerSettings = {
  credentials: {
    verifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
    pageToken: process.env.FACEBOOK_PAGE_TOKEN,
    fbAppSecret: process.env.FACEBOOK_APP_SECRET,
  },
  webhookEndpoint: process.env.FACEBOOK_WEBHOOK_ENDPOINT
};

const messengerBot = new MessengerBot(messengerSettings);

botmaster.addBot(messengerBot);

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/// Bot platforms - END
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////



/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/// Bot middleware - START
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

const incomingMiddleware = require('./middleware/incoming');
const outgoingMiddleware = require('./middleware/outgoing');
const wrappedMiddleware = require('./middleware/wrapped');


/////////////////////////////////////////////////////
/// Bot middleware incoming: DB - store all incoming messages (from user to bot)
/////////////////////////////////////////////////////

// TODO
// botmaster.use(incomingMiddleware.db.storeMessage);

/////////////////////////////////////////////////////
/// Bot middleware incoming:  translate incoming message
/////////////////////////////////////////////////////
if (process.env.WATSON_LANGUAGE_TRANSLATOR_ENABLED == 'true') {
  botmaster.use(incomingMiddleware.translate.translateMessage);
}


/////////////////////////////////////////////////////
/// Bot middleware incoming: IBM Watson Conversation Middleware and SessionWare
/////////////////////////////////////////////////////

// might want to use this in conjunction with your own store in production
// as SessionWare uses the non-production ready MemoryStore by default
const SessionWare = require('botmaster-session-ware');
const WatsonConversationWare = require('botmaster-watson-conversation-ware');

// Setting Watson Conversation/Assistant credentials
const watsonConversationWareOptions = {
  settings: {
    username: process.env.WATSON_ASSISTANT_USERNAME,
    password: process.env.WATSON_ASSISTANT_PASSWORD,
    version: process.env.WATSON_ASSISTANT_VERSION, // new Watson Assistant v2 is available, but to use it first we need to update the "botmaster-watson-conversation-ware" library
    version_date: process.env.WATSON_ASSISTANT_VERSION_DATE, // '2017-05-26' = version of when the demo repo was created
  },
  workspaceId: process.env.WATSON_ASSISTANT_WORKSPACE_ID // Currently poiting to the skill/workspace "Customer Care"
}

// Declaring middleware
const watsonConversationWare = WatsonConversationWare(watsonConversationWareOptions);
botmaster.use(watsonConversationWare);

// This will make our context persist throughout different messages from the same user
const sessionWare = new SessionWare();
botmaster.useWrapped(sessionWare.incoming, sessionWare.outgoing);


/////////////////////////////////////////////////////
/// Bot middleware incoming: Reply user (watsonUpdate)
/////////////////////////////////////////////////////
botmaster.use(incomingMiddleware.reply.replyToUser);

/////////////////////////////////////////////////////
/// Bot middleware outgoing:  translate outgoing message
/////////////////////////////////////////////////////
if (process.env.WATSON_LANGUAGE_TRANSLATOR_ENABLED == 'true') {
  botmaster.use(outgoingMiddleware.translate.translateMessage);
}


/////////////////////////////////////////////////////
/// Bot middleware outgoing:  DB - store all outgoing messages (from bot to user)
/////////////////////////////////////////////////////

// TODO


/////////////////////////////////////////////////////
/// Bot middleware outgoing:  show is typing meesage
/////////////////////////////////////////////////////

// botmaster.use(outgoingMiddleware.botIsTyping.sendTypingMessage); // Error: Bots of type socket.io can't send messages with typing_on sender action at SocketioBot.sendIsTypingMessageTo


/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/// Bot middleware - END
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////


/////////////////////////////////////////////////////
/// Botmaster error log
/////////////////////////////////////////////////////

botmaster.on('error', (bot, err) => {
  console.log(err.stack);
});
