"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "setup", {
  enumerable: true,
  get: function get() {
    return _base["default"];
  }
});
Object.defineProperty(exports, "configure", {
  enumerable: true,
  get: function get() {
    return _form_creator["default"];
  }
});
exports.translations = void 0;

var _base = _interopRequireDefault(require("./base"));

var _form_creator = _interopRequireDefault(require("./form_creator"));

var _nl = _interopRequireDefault(require("./i18n/nl"));

var _en = _interopRequireDefault(require("./i18n/en"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// console.log(nl)
var nl = {
  form: _nl["default"]
};
var en = {
  form: _en["default"]
};
var translations = {
  en: en,
  nl: nl
};
exports.translations = translations;