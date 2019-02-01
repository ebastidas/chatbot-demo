// Doesn't work for Socket.io Bot, only for FB and others
const sendTypingMessage = {
  type: 'outgoing',
  name: 'show-indicator-before-sending-message',
  controller: (bot, update, message, next) => {
    const userId = message.recipient.id;

    bot.sendIsTypingMessageTo(userId, { ignoreMiddleware: true })
    .then(() => {
      setTimeout(() => {
        next();
      }, 1000);
    });
  },
};

module.exports = {
  sendTypingMessage,
}
