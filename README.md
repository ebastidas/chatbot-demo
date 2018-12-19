# chatbot-demo

This repo shows a demo of a simple Shop's Customer Service chatbot. It's powered by IBM Watson Conversation/Assistant service and based on the web client from [Botmaster](http://botmasterai.com).

To start this application, first change the environment variables in the file ".env" to your Watson API Key and the Watson Assistant Workspace/Skill ID (add the sample Customer Care Skill in your Watson Assistance service).

Then run the following:
1. ```npm install```
2. ```node server.js```

Then open in a browser ```http://0.0.0.0:3000``` and start chatting.

This chatbot can also be integrated with Slack, Facebook Messenger, Twitter, Telegram, and others, via the [Botmaster packages](http://botmasterai.com/documentation/latest/messaging-platforms.html)

A sample of a chat you can have with the bot is one like the following:

![chat-sample](https://raw.githubusercontent.com/ebastidas/chatbot-demo/master/docs/chat-sample.png)

