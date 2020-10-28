"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.alert = exports.t = void 0;

var t = function t(text) {
  return text;
};

exports.t = t;

var alert = function alert(text) {
  return console.log(text);
};

exports.alert = alert;

var setup = function setup() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      translatorFunc = _ref.translatorFunc,
      alertFunc = _ref.alertFunc;

  if (translatorFunc) exports.t = t = translatorFunc;
  if (alertFunc) exports.alert = alert = alertFunc;
};

var _default = setup;
exports["default"] = _default;