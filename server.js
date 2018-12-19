// Load enviroment variables from file ".env"
const dotenv = require('dotenv').config();

const Botmaster = require('botmaster');
// Using this socket.io bot class for the sake of the example
const SocketioBot = require('botmaster-socket.io');
// might want to use this in conjunction with your own store in production
// as SessionWare uses the non-production ready MemoryStore by default
const SessionWare = require('botmaster-session-ware');
const WatsonConversationWare = require('botmaster-watson-conversation-ware');
const express = require('express');

const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";
const app = express();

// Routing for ./public/index.html
app.use(express.static(__dirname + '/public'));

const server = app.listen(port, host, () => {
    console.log('Server listening at http://%s:%d', host, port);
});

// Adding a new Botmaster
const botmaster = new Botmaster({
  server
});

// Adding a SocketIo to botmaster
botmaster.addBot(new SocketioBot({
  id: 'SOCKETIO_BOT_ID',
  // server: botmaster.server, // this is required for socket.io. You can set it to another node server object if you wish to. But in this example, we will use the one created by botmaster under the hood
  server: server
}));

// Setting Watson Conversation/Assistant credentials
const watsonConversationWareOptions = {
  settings: {
    username: "apikey",
    password: process.env.WATSON_ASSISTANT_PASSWORD,
    version: 'v1', // new v2 available, need to update the "botmaster-watson-conversation-ware" library
    // version_date: '2017-05-26', // version of when the demo repo was created
    version_date: '2018-09-20',
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

    console.log('--------------------------');
    console.log('---update.watsonUpdate----');
    console.log('--------------------------');
    console.log(JSON.stringify(update.watsonUpdate, null, 4));

    console.log('-----------------------------------');
    console.log('---update.session.watsonContext----');
    console.log('-----------------------------------');
    console.log(JSON.stringify(update.session.watsonContext, null, 4));

    console.log('--------------------------------');
    console.log('---update.watsonConversation----');
    console.log('--------------------------------');
    console.log(JSON.stringify(update.watsonConversation, null, 4));

    // watsonUpdate.output.text is an array as watson can reply with a few messages one after another
    return bot.sendTextCascadeTo(update.watsonUpdate.output.text, update.sender.id);
  }
})

// This will make our context persist throughout different messages from the same user
const sessionWare = new SessionWare();
botmaster.useWrapped(sessionWare.incoming, sessionWare.outgoing);

botmaster.on('error', (bot, err) => {
  console.log(err.stack);
});
