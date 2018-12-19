// the following line could also be: "var socket = io('ws://<URL>:<PORT_Number>?botmasterUserId=wantedUserId');"
// if you know you will be communicating with a server different from the one that served you the page you are on.
// this only works because the socket.io library assumes with this syntax that the socket.io server
// lives at the same address as the server that served this page (this should mostly be your case)
//var socket = io('?botmasterUserId=wantedUserId');
var socket = io('ws://0.0.0.0:3000?botmasterUserId=USER_ID'); // TODO: change "USER_ID" to user id after authentication

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
});
