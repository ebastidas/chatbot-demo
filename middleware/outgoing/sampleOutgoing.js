const actionToDo = {
  type: 'outgoing',
  name: 'sample-outgoing',
  //controller: (bot, update, message, next) => {
  controller: (bot, update, message) => {
    //console.log(update.watsonUpdate.output.text);
    if (message.message.text === 'Thank you') {
      // yes, this is very arbitrary. But again, tries to drive the point of how middleware works
      message.message.text = 'Thanks';
    }
    return Promise.resolve();
    //next();
  }
};

module.exports = {
  actionToDo,
}
