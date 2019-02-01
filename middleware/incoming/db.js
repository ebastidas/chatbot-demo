const storeMessage = {
  type: 'incoming',
  name: 'store-message',
  controller: (bot, update) => {
    // TODO
    //console.log(update);
    return Promise.resolve();
  }
};

module.exports = {
  storeMessage,
}
