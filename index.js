'use strict';

var alexa = require('alexa-app');
var calendar = require('./lib/lightsCalendar.js');
var moment = require('moment-timezone');

var TIMEZONE = 'Pacific/Honolulu';
var WELCOME_TITLE = 'Welcome to the Empire State Building Tower Lights calendar skill.';
var WELCOME_DESCRIPTION = ['This skill allows you to find out what the colors of the Empire State ',
			   'Building mean for a given day.'].join('');
var HELP_RESPONSE = ['Try saying "Alexa, ask the Empire State Building what the colors are today".',
		      'Or you can try asking for a specific day by saying "Alexa, ask the Empire ',
		      'State Building what the colors will be tomorrow"'].join('');

var ESBColors = new alexa.app('esbColors');

ESBColors.launch(function (request, response) {
  var welcome = [WELCOME_DESCRIPTION, HELP_RESPONSE].join(' ');

  response
    .say(WELCOME_TITLE)
    .say(welcome)
    .card(WELCOME_TITLE, welcome)
    .send();
});

ESBColors.intent('AMAZON.HelpIntent', function (request, response) {
  response
    .say(HELP_RESPONSE)
    .card('ESB Colors Help', [WELCOME_DESCRIPTION, HELP_RESPONSE].join(' '))
    .send();
});

ESBColors.intent('ESBColorToday', function (request, response) {
  calendar.getLightsForDate().then(function (light) {
    var speechOutput = getSpeechResponse(light);
    response.say(speechOutput).send();
  });

  // Async response
  return false;
});

ESBColors.intent('ESBColorDate', function (request, response) {
  var slotData = request.slot('Date');
  var date = moment(slotData).tz(TIMEZONE);

  calendar.getLightsForDate(date).then(function (light) {
    var speechOutput = getSpeechResponse(light, slotData);
    response.say(speechOutput).send();
  });

  // Async response
  return false;
});

/**
 * Returns a formatted speech response given the current date and request information.
 *
 * @param {Object} result -- Tower Lights calendar result
 * @param {String} requestedDate -- Date requested by the user
 * @returns {String}
 */
function getSpeechResponse(result, requestedDate) {
  var date = moment(requestedDate || undefined).tz(TIMEZONE);

  var now = moment();
  var verb = 'is';
  var suffix = '.';
  var description = result ? result.description : 'Signature White';

  if (requestedDate) {
    if (date.isBefore(now)) {
      verb = 'was';
    }
    else if (date.isAfter(now)) {
      verb = 'will be';
    }
  }

  if (requestedDate && !date.isSame(now)) {
      suffix = ', on ' + date.format('MMMM DD, YYYY');
  }

  return 'The Empire State building ' + verb + ' lit ' + description + suffix;
}

exports.handler = ESBColors.lambda();
