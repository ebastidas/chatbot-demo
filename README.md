# chatbot-demo

This repo shows a demo of a simple Shop's Customer Service chatbot. It's powered by IBM Watson Conversation/Assistant service and based on the web client from [Botmaster](http://botmasterai.com).

 To run this application, first create a Watson Assistant service in IBM Cloud and add the sample Customer Care Skill to your instance. Then change the environment variables in the file ".env" to your Watson Assistant Password (WATSON_ASSISTANT_PASSWORD) and the Watson Assistant Workspace/Skill ID (WATSON_ASSISTANT_WORKSPACE_ID). Check this [link](https://cloud.ibm.com/docs/services/watson/getting-started-credentials.html#getting-credentials-manually) to get these credentials.

1. Install the app:

    `npm install`

2. Then run the app:

    `node server.js`

Then open in a browser ```http://0.0.0.0:3000``` and start chatting.

This chatbot can also be integrated with Slack, Facebook Messenger, Twitter, Telegram, and others, via the [Botmaster packages](http://botmasterai.com/documentation/latest/messaging-platforms.html)

Here a sample of a chat you can have with the bot:

![chat-sample](https://raw.githubusercontent.com/ebastidas/chatbot-demo/master/docs/chat-sample.png)



# How to run chatbot locally and expose it to a public URL using LocalTunnel.me

1. Run the server locally:

    `node server.js`

2. While the server runs, open another terminal and run the command:

    `npm run tunnel`

3. Open a browser and start chatting at:

    `http://chatbot-botmasterai.localtunnel.me/`



TODO: Add HTTPS local server to be able to use ```https://chatbot-botmasterai.localtunnel.me/```, and being able to connect it to Facebook Messenger using this URL as 'Callback URL'.



# How to run chatbot using IBM Cloud

1. Create an IBM Cloud Node.js app and push the code: ```bluemix app push APP_NAME```. Change the name of your app (APP_NAME), for example:

    ```bluemix app push chatbot-botmasterai```

2. Open a browser and start chatting at:

    ```https://chatbot-botmasterai.mybluemix.net/```



# How to run chatbot using Facebook Messenger

Follow these [instructions]( https://github.com/botmasterai/botmaster-messenger#getting-your-credentials) to get your credentials.

1. Generate a Facebook page access token. Follow the steps 1 and 2 from these [instructions](https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start).

2. Save your page token as an environment variable. Edit the environment variables in the file ".env" to the generated page access token (FACEBOOK_PAGE_TOKEN) and your Facebook App Secret (FACEBOOK_APP_SECRET). Edit the variable FACEBOOK_VERIFY_TOKEN to any random secure string, this is not something given by facebook, but this is your private personal key/token. Edit the variable FACEBOOK_WEBHOOK_ENDPOINT to any random secure string, this the token that Facebook will echo back to you as part of callback URL verification.

3. Run the app from an HTTPS server (Facebook requires an SSL connection). For example follow the instructions to run the chatbot from IBM Cloud, which will start a server in something like ```https://MY_APP_NAME.mybluemix.net```.

4. Configure the Webhook for your app, following all these [instructions](https://developers.facebook.com/docs/messenger-platform/getting-started/app-setup). If you set up the server in IBM Cloud, as 'Callback URL' use the following ```https://MY_APP_NAME.mybluemix.net/messenger/FACEBOOK_WEBHOOK_ENDPOINT/``` (as an example: ```https://chatbot-botmasterai.mybluemix.net/messenger/webhook1234/```), and as Verify Token the value you saved as FACEBOOK_VERIFY_TOKEN in the .env file.

5. Subscribe your app to a Facebook Page and start chatting with the chatbot by sending a message to the Facebook Page connected.
