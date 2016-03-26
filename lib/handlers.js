'use strict';

var calendar = require('./lightsCalendar.js');
var moment = require('moment-timezone');

var WELCOME_DESCRIPTION = ['This skill allows you to find out what the colors of the Empire State ',
    'Building mean for a given day.'].join('');
var HELP_RESPONSE = ['Try asking "what are the colors today?" Or you can try for a specific ',
    'day by asking "what will the colors be tomorrow?"'].join('');

/**
 * Handles requests for the Empire State Building colors intents.
 * @param {Object} request -- Request object from AlexaApp module.
 * @param {Object} response -- Response object from AlexaApp module.
 * @returns {Boolean}
 */
function handleColorsIntent(request, response) {
  var slotData = request.slot('Date');
  var format = calendar.SPOKEN_DATE_FORMAT;
  var tz = calendar.TIMEZONE;

  var date = moment(slotData).tz(tz);
  var now = moment().tz(tz);
  var cardTitle = 'Empire State Building Lights';

  if (date && date.format(format) !== now.format(format)) {
    cardTitle += ': ' + date.format(format);
  }

  calendar.getLightsForDate(date).then(function (light) {
    response
      .say(getSpeechResponse(light))
      .card(cardTitle, light.description)
      .send();
  });

  // Async response
  return false;
}

/**
 * Handles requests for help with the skill.
 * @param {Object} request -- Request object from AlexaApp module.
 * @param {Object} response -- Response object from AlexaApp module.
 */
function handleHelpIntent(request, response) {
  response
    .say(HELP_RESPONSE)
    .shouldEndSession(false)
    .card('Empire State Building Lights', [WELCOME_DESCRIPTION, HELP_RESPONSE].join(' '))
    .send();
}

/**
 * Returns a formatted speech response given the current date and request information.
 * @param {Object} result -- Tower Lights calendar result
 * @param {String} requestedDate -- Date requested by the user
 * @returns {String}
 */
function getSpeechResponse(result, requestedDate) {
  var date = moment(requestedDate || undefined).tz(calendar.TIMEZONE);

  var now = moment().tz(calendar.TIMEZONE);;
  var verb = 'is';
  var suffix = '';
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
    suffix = ', on ' + date.format(calendar.SPOKEN_DATE_FORMAT);
  }

  return 'The Empire State Building ' + verb + ' lit ' + description.replace(' & ', ' and ') + suffix;
}

module.exports = {
  handleColorsIntent: handleColorsIntent,
  handleHelpIntent: handleHelpIntent
}
