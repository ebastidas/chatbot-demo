// the following line could also be: "var socket = io('ws://<URL>:<PORT_Number>?botmasterUserId=wantedUserId');"
// if you know you will be communicating with a server different from the one that served you the page you are on.
// this only works because the socket.io library assumes with this syntax that the socket.io server
// lives at the same address as the server that served this page (this should mostly be your case)
//var socket = io('?botmasterUserId=wantedUserId');


var socket;
var hostname = window.location.hostname;
var USER_ID = uuidv4();
if (hostname.includes('mybluemix')){
  socket = io('wss://'+ hostname +'?botmasterUserId=' + USER_ID); // use it for IBM Cloud
}
else{
  socket = io('ws://0.0.0.0:3000?botmasterUserId=' + USER_ID); // use it when running locally without HTTPS. To run with localtunnel.me use: http://chatbot-botmasterai.localtunnel.me/
  // socket = io('wss://0.0.0.0:3000?botmasterUserId=' + USER_ID); // use it when running locally with HTTPS, To run with localtunnel.me use: https://chatbot-botmasterai.localtunnel.me/
}

// just get the html elements we will be needing by ID
var form = document.getElementById('form');
var textInput = document.getElementById('text-input');
var messages = document.getElementById('messages');

form.onsubmit = function(event) {
  // just making sure the page isn't refreshed
  event.preventDefault();
  // don't do anything if there is no text
  if (!textInput.value) {
    return;
  }
  // Add the user message to the web page
  messages.insertAdjacentHTML('beforeend',
    `<li class="user-message">me:&nbsp;${textInput.value}</li>`);
  // create a botmaster compatible message from the text input by the user
  const update = {
    message: {
      text: textInput.value
    }
  };
  // send the message over the webSocket
  socket.send(update);
  // finally, clear the user textInput field
  textInput.value = '';
};

socket.on('message', function(botmasterMessage){
  var textMessage = botmasterMessage.message.text;

  messages.insertAdjacentHTML('beforeend',
    `<li class="botmaster-message">bot:&nbsp;${textMessage}</li>`);

  if(botmasterMessage.translatation.enabled == 'true'){
    console.log('textIncomingBeforeTranslation: ' + botmasterMessage.translatation.textIncomingBeforeTranslation);
    console.log('textIncomingAfterTranslation: ' + botmasterMessage.translatation.textIncomingAfterTranslation);
    console.log('textOutgoingBeforeTranslation: ' + botmasterMessage.translatation.textOutgoingBeforeTranslation);
    console.log('textOutgoingAfterTranslation: ' + botmasterMessage.translatation.textOutgoingAfterTranslation);
    console.log('---------------------------');
  }
});
