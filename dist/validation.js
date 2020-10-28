"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rules = exports.messages = exports.isEmail = void 0;

var _passwordValidator = _interopRequireDefault(require("password-validator"));

var _utils = _interopRequireDefault(require("@eitje/utils"));

var _index = require("index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var isEmail = function isEmail(val) {
  var emailCheck = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  return val.length == 0 || emailCheck.test(val.trim());
};

exports.isEmail = isEmail;

var isPass = function isPass(val) {
  if (!val) return true;
  var schema = new _passwordValidator["default"]();
  schema.isMin(6).has().uppercase().lowercase().digits();
  return schema.validate(val);
};

var fieldRules = {
  password_confirmation: function password_confirmation(value, data) {
    return data.password === value;
  },
  password: function password(value) {
    return isPass(value);
  },
  email: function email(value) {
    return isEmail(value);
  }
};
var nameRules = {
  team_image_url: function team_image_url(value, data) {
    return !data['chatgroep_actief'] || _utils["default"].exists(value) || data["remote_avatar_url"];
  }
};
var fieldMessages = {
  password: 'incorrectPas',
  password_confirmation: 'passwordMatch',
  email: 'emailInvalid'
};
var nameMessages = {
  team_image_url: "selectImage"
};
var messages = {
  field: fieldMessages,
  name: nameMessages
};
exports.messages = messages;
var rules = {
  field: fieldRules,
  name: nameRules
};
exports.rules = rules;