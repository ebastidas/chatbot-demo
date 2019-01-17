// TODO: encrypt app to run HTTPS locally, check:
// https://github.com/botmasterai/botmaster-socket.io/issues/2#issuecomment-303785233
// https://www.sitepoint.com/how-to-use-ssltls-with-node-js/

// Load enviroment variables from file ".env"
const dotenv = require('dotenv').config();


/////////////////////////////////////////////////////
/// Express server for frontend app
/////////////////////////////////////////////////////

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
/// Botmaster
/////////////////////////////////////////////////////

const Botmaster = require('botmaster');

// Adding a new Botmaster
const botmaster = new Botmaster({
  server
});

/////////////////////////////////////////////////////
/// SocketIo Bot
/////////////////////////////////////////////////////

// Using this socket.io bot class for the sake of the example
const SocketioBot = require('botmaster-socket.io');

// Adding a SocketIo to botmaster
botmaster.addBot(new SocketioBot({
  id: 'SOCKETIO_BOT_ID',
  // server: botmaster.server, // this is required for socket.io. You can set it to another node server object if you wish to. But in this example, we will use the one created by botmaster under the hood
  server: server
}));


/////////////////////////////////////////////////////
/// Facebook Bot
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
/// IBM Watson Middleware
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

botmaster.use({
  type: 'incoming',
  name: 'watson-assistant-middleware',
  // includeEcho: true (defaults to false), opt-in to get echo updates
  // includeDelivery: true (defaults to false), opt-in to get delivery updates
  // includeRead: true (defaults to false), opt-in to get user read updates
  controller: (bot, update) => {
    //console.log(update);
    //console.log(JSON.stringify(update.watsonUpdate, null, 4));
    //console.log(JSON.stringify(update.session.watsonContext, null, 4));
    //console.log(JSON.stringify(update.watsonConversation, null, 4));

    // watsonUpdate.output.text is an array as watson can reply with a few messages one after another
    return bot.sendTextCascadeTo(update.watsonUpdate.output.text, update.sender.id);
  }
})

// This will make our context persist throughout different messages from the same user
const sessionWare = new SessionWare();
botmaster.useWrapped(sessionWare.incoming, sessionWare.outgoing);


/////////////////////////////////////////////////////
/// Botmaster error log
/////////////////////////////////////////////////////

botmaster.on('error', (bot, err) => {
  console.log(err.stack);
});
