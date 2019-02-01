const actionToDo = {
  type: 'incoming',
  name: 'sample-incoming',
  // includeEcho: true, // (defaults to false), opt-in to get echo updates
  // includeDelivery: true, // (defaults to false), opt-in to get delivery updates
  // includeRead: true, // (defaults to false), opt-in to get user read updates
  controller: (bot, update) => {
    if (bot.retrievesUserInfo) {
      return bot.getUserInfo(update.sender.id).then((userInfo) => {
        update.userInfo = userInfo;
      })
    }
    return Promise.resolve();
  }
};

module.exports = {
  actionToDo,
}
