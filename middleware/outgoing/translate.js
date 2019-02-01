const debug = require('debug')('botmaster:watson-translate-outgoing-middleware');

const translateMessage = {
  type: 'outgoing',
  name: 'translate-outgoing-text',
  controller: (bot, update, message, next) => {

    var LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
    var languageTranslator = new LanguageTranslatorV3({
      version: process.env.WATSON_LANGUAGE_TRANSLATOR_VERSION,
      iam_apikey: process.env.WATSON_LANGUAGE_TRANSLATOR_IAM_APIKEY,
      url: process.env.WATSON_LANGUAGE_TRANSLATOR_URL
    });

    var parameters = {
      text: message.message.text, // Single line to translate
      model_id: 'en-' + process.env.WATSON_LANGUAGE_TRANSLATOR_TARGET_LANGUAGE
    };

    languageTranslator.translate(
      parameters,
      function(error, response) {
        if (error){
          console.log(error)
        }
        else{
          message.translatation = {};
          message.translatation.enabled = process.env.WATSON_LANGUAGE_TRANSLATOR_ENABLED;
          message.translatation.textIncomingBeforeTranslation = update.message.textIncomingBeforeTranslation;
          message.translatation.textIncomingAfterTranslation = update.message.textIncomingAfterTranslation;

          message.translatation.textOutgoingBeforeTranslation = message.message.text;
          debug('outgoing message (before transaltion): ' + message.translatation.textOutgoingBeforeTranslation);

          message.message.text = response.translations[0].translation; // Single line translated

          message.translatation.textOutgoingAfterTranslation = message.message.text;
          debug('outgoing message (after transaltion): ' + message.translatation.textOutgoingAfterTranslation);

          next(); // return Promise.resolve(); // return to Botmaster
        }
      }
    );

  }
};

module.exports = {
  translateMessage,
}
