'use strict';

var handlers = require('./handlers.js');

var alexa = require('alexa-app');
var ESBColors = new alexa.app('esbColors');

ESBColors.launch(handlers.handleColorsIntent);
ESBColors.intent('ESBColorToday', handlers.handleColorsIntent);
ESBColors.intent('ESBColorDate', handlers.handleColorsIntent);
ESBColors.intent('AMAZON.HelpIntent', handlers.handleHelpIntent);

module.exports = ESBColors;
