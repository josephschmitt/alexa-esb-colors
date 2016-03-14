'use strict';

var _ = require('lodash');
var moment = require('moment');
var noodle = require('noodlejs');
var Promise = require('bluebird');

var DATE_FORMAT = 'MMM DD, YYYY';

var TOWER_LIGHTS_CAL_URL = 'http://www.esbnyc.com/explore/tower-lights/calendar';
var DATE_SELECTOR = '.item-list a span.date-display-single';
var DESCRIPTION_SELECTOR = '.item-list .lighting-desc';

var NOODLE_QUERY = {
  url: TOWER_LIGHTS_CAL_URL,
  type: 'html',
  selector: 'ul.social li a',
  extract: 'href',
};

/**
 * Requests the tower lights calendar and returns the entire schedule in JSON format.
 * @returns {Object}
 */
function getSchedule() {
  return noodle.fetch(TOWER_LIGHTS_CAL_URL, {}).then(function (html) {
    return Promise.all([
      noodle.html.select(html, {selector: DATE_SELECTOR}),
      noodle.html.select(html, {selector: DESCRIPTION_SELECTOR})
    ]);
  })
  .then(function (values) {
    var dates = values[0];
    var descriptions = values[1];

    noodle.stopCache();

    return _.map(dates, function (date, i) {
      return {
	date: dates.results[i],
	description: descriptions.results[i]
      }
    });
  });
};

/**
 * Requests the lights calendar and returns the entry for a given date. If no date is supplied,
 * today's date is used by default.
 * @param {Date} date
 * @returns {Object}
 */
function getLightsForDate(date) {
  date = moment(date);

  return getSchedule().then(function (schedule) {
    var dateText = date.format(DATE_FORMAT);
    return _.find(schedule, {date: dateText});
  });
};

module.exports.getSchedule = getSchedule;
module.exports.getLightsForDate = getLightsForDate;
module.exports.DATE_FORMAT = DATE_FORMAT;
