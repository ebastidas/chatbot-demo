const debug = require('debug')('botmaster:watson-translate-incoming-middleware');

const translateMessage = {
  type: 'incoming',
  name: 'translate-incoming-text',
  controller: (bot, update, next) => {

    var LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
    var languageTranslator = new LanguageTranslatorV3({
      version: process.env.WATSON_LANGUAGE_TRANSLATOR_VERSION,
      iam_apikey: process.env.WATSON_LANGUAGE_TRANSLATOR_IAM_APIKEY,
      url: process.env.WATSON_LANGUAGE_TRANSLATOR_URL
    });

    var parameters = {
      text: update.message.text, // Single line to translate
      model_id: process.env.WATSON_LANGUAGE_TRANSLATOR_TARGET_LANGUAGE + '-en'
    };

    languageTranslator.translate(
      parameters,
      function(error, response) {
        if (error){
          console.log(error)
        }
        else{
          update.message.textIncomingBeforeTranslation = update.message.text;
          debug('incoming message (before transaltion): ' + update.message.textIncomingBeforeTranslation);

          update.message.text = response.translations[0].translation; // Single line translated

          update.message.textIncomingAfterTranslation = update.message.text;
          debug('incoming message (after transaltion): ' + update.message.textIncomingAfterTranslation);
          next(); // return Promise.resolve(); // return to Botmaster
        }
      }
    );
  }
};

module.exports = {
  translateMessage,
}
