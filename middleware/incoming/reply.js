const replyToUser = {
  type: 'incoming',
  name: 'reply-to-user',
  // includeEcho: true, // (defaults to false), opt-in to get echo updates
  // includeDelivery: true, // (defaults to false), opt-in to get delivery updates
  // includeRead: true, // (defaults to false), opt-in to get user read updates
  controller: async (bot, update) => {
    //console.log(update);
    //console.log(JSON.stringify(update.watsonUpdate, null, 4));
    //console.log(JSON.stringify(update.session.watsonContext, null, 4));
    //console.log(JSON.stringify(update.watsonConversation, null, 4));

    // watsonUpdate.output.text is an array as watson can reply with a few messages one after another
    const body = await bot.sendTextCascadeTo(update.watsonUpdate.output.text, update.sender.id);
    // do stuff with the body object
    //console.log(JSON.stringify(body, null, 4));
  }
};

module.exports = {
  replyToUser,
}
