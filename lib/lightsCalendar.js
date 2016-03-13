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
 * [wrap description]
 * @param {[type]} function ( [description]
 * @returns {[type]} [description]
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

function getLightsForDate(date) {
  date = date || moment();

  return getSchedule().then(function (schedule) {
    var dateText = date.format(DATE_FORMAT);
    return _.find(schedule, {date: dateText});
  });
};

module.exports.getSchedule = getSchedule;
module.exports.getLightsForDate = getLightsForDate;
module.exports.DATE_FORMAT = DATE_FORMAT;
