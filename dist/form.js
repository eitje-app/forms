"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _react = _interopRequireWildcard(require("react"));

var _utils = _interopRequireDefault(require("@eitje/utils"));

var _base = require("./base");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Form = /*#__PURE__*/function (_Component) {
  _inherits(Form, _Component);

  var _super = _createSuper(Form);

  function Form(props) {
    var _this;

    _classCallCheck(this, Form);

    var _fields = props.initialValues && _lodash["default"].isObject(props.initialValues) ? _lodash["default"].cloneDeep(props.initialValues) : {};

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "createRefs", function () {
      _this.myChildren().forEach(function (c, idx) {
        _this["child-".concat(idx)] = /*#__PURE__*/(0, _react.createRef)();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "myChildren", function () {
      var _this$props$children = _this.props.children,
          children = _this$props$children === void 0 ? [] : _this$props$children;
      return _lodash["default"].isArray(children) ? children : [children];
    });

    _defineProperty(_assertThisInitialized(_this), "convertFields", function () {
      var nestedField = _this.props.nestedField;
      var fields = _this.state.fields;
      return Object.keys(fields).map(function (id) {
        return _objectSpread(_defineProperty({}, nestedField, id), fields[id]);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "submitted", function () {
      return _this.state.submitted;
    });

    _defineProperty(_assertThisInitialized(_this), "setNestedField", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(field, val, itemId) {
        var fields, newFields;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                fields = _this.state.fields;
                newFields = _objectSpread(_objectSpread({}, fields), {}, _defineProperty({}, itemId, _objectSpread(_objectSpread({}, fields[itemId]), {}, _defineProperty({}, field, val))));

                _this.setState({
                  fields: newFields
                });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "updateField", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(field, val, itemId, fieldProps) {
        var _this$state, fields, errors, touched, afterChange;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$state = _this.state, fields = _this$state.fields, errors = _this$state.errors, touched = _this$state.touched;
                afterChange = _this.props.afterChange;
                if (_lodash["default"].isArray(val) && val.length === 0) val = undefined;

                if (!(_this.state.fields[field] === val)) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return");

              case 5:
                if (!itemId) {
                  _context2.next = 9;
                  break;
                }

                _this.setNestedField(field, val, itemId);

                _context2.next = 12;
                break;

              case 9:
                _context2.next = 11;
                return _this.setState(function (state) {
                  return {
                    fields: _objectSpread(_objectSpread({}, state.fields), {}, _defineProperty({}, field, val))
                  };
                });

              case 11:
                _this.validateField(field, true, fieldProps);

              case 12:
                afterChange && afterChange(field, val);

                if (!touched) {
                  _this.setState({
                    touched: true
                  });
                }

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x4, _x5, _x6, _x7) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(_assertThisInitialized(_this), "allFormChildren", function () {
      return _this.getFormChildren();
    });

    _defineProperty(_assertThisInitialized(_this), "getFormChildren", function () {
      var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _assertThisInitialized(_this);
      if (!el.props) return [];
      var children = el.props.children;
      children = _utils["default"].alwaysArray(children);
      var els = children.filter(function (c) {
        return c && c.props && c.props.field;
      });
      var stringEls = children.filter(function (c) {
        return _lodash["default"].isString(c);
      });
      var wrappers = children.filter(function (c) {
        return c && c.props && c.props.fieldWrapper;
      });
      wrappers.forEach(function (wrapper) {
        els = els.concat(_this.getFormChildren(wrapper));
      });
      return els;
    });

    _defineProperty(_assertThisInitialized(_this), "blockSubmit", function (field, blocked) {
      _this.setState({
        blocked: _objectSpread(_objectSpread({}, _this.state.blocked), {}, _defineProperty({}, field, blocked))
      });

      var that = _assertThisInitialized(_this);

      if (blocked) {
        setTimeout(function () {
          return that.blockSubmit(field, false);
        }, 15000);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "setValues", function (obj) {
      var fields = _this.state.fields;

      _this.setState({
        fields: _objectSpread(_objectSpread({}, fields), obj)
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getNext", function (idx) {
      var ch = _this["child-".concat(idx + 1)];

      if (ch && !ch.current) {
        return {
          current: ch
        };
      } else {
        return ch;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "getValue", function (field, itemId) {
      var fields = _this.state.fields;
      return itemId ? fields[itemId][field] : fields[field];
    });

    _defineProperty(_assertThisInitialized(_this), "enhanceChild", function (c, idx) {
      var _this$props = _this.props,
          _this$props$updatedFi = _this$props.updatedFields,
          updatedFields = _this$props$updatedFi === void 0 ? [] : _this$props$updatedFi,
          disabled = _this$props.disabled,
          onSubmit = _this$props.onSubmit;
      var _c$props = c.props,
          field = _c$props.field,
          itemId = _c$props.itemId;
      var _this$state2 = _this.state,
          errors = _this$state2.errors,
          fields = _this$state2.fields;

      var newEl = /*#__PURE__*/_react["default"].cloneElement(c, {
        key: itemId ? "".concat(itemId, "-").concat(field) : field,
        formDisabled: disabled,
        innerRef: c.props.innerRef || _this["child-".concat(idx)],
        updated: updatedFields.includes(field),
        formData: fields,
        value: _this.getValue(field, itemId),
        blockSubmit: function blockSubmit() {
          var block = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          return _this.blockSubmit(field, block);
        },
        submitForm: function submitForm() {
          return _this.submit();
        },
        onChange: function onChange(val) {
          return _this.updateField(field, val, itemId, c.props);
        },
        error: errors[field],
        getNext: function getNext() {
          return _this.getNext(idx);
        }
      });

      return newEl;
    });

    _defineProperty(_assertThisInitialized(_this), "renderChild", function (c, idx) {
      if (!c) return null;
      var DefaultInput = _this.props.DefaultInput;

      if (_lodash["default"].isString(c) && DefaultInput) {
        return _this.enhanceChild( /*#__PURE__*/_react["default"].createElement(DefaultInput, {
          field: c
        }), idx);
      }

      if (!c.props) return;
      var _this$state3 = _this.state,
          errors = _this$state3.errors,
          fields = _this$state3.fields;
      var _c$props2 = c.props,
          field = _c$props2.field,
          fieldWrapper = _c$props2.fieldWrapper;

      if (fieldWrapper && c.props.children) {
        var children = _this.mapChildren(c.props.children);

        return /*#__PURE__*/_react["default"].cloneElement(c, {
          children: children
        });
      }

      if (field) {
        return _this.enhanceChild(c, idx);
      } else {
        return /*#__PURE__*/_react["default"].cloneElement(c);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "mapChildren", function () {
      var children = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var childs = _utils["default"].alwaysDefinedArray(children);

      return childs.map(function (c) {
        if (!c || !c.props) return c;
        if (c.props.field) return _this.enhanceChild(c);
        if (!c.props.children) return c;
        return /*#__PURE__*/_react["default"].cloneElement(c, {
          children: _this.mapChildren(c.props.children)
        });
      });
    });

    _this.createRefs();

    _this.state = {
      loading: false,
      blocked: {},
      errors: {},
      fields: _fields
    };
    return _this;
  }

  _createClass(Form, [{
    key: "submit",
    value: function () {
      var _submit = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var _ref3,
            _ref3$extraData,
            extraData,
            _this$props2,
            nestedField,
            onSubmit,
            afterSubmMessage,
            _this$props2$afterSub,
            afterSubmit,
            fields,
            params,
            res,
            _args3 = arguments;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _ref3 = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {}, _ref3$extraData = _ref3.extraData, extraData = _ref3$extraData === void 0 ? {} : _ref3$extraData;
                _this$props2 = this.props, nestedField = _this$props2.nestedField, onSubmit = _this$props2.onSubmit, afterSubmMessage = _this$props2.afterSubmMessage, _this$props2$afterSub = _this$props2.afterSubmit, afterSubmit = _this$props2$afterSub === void 0 ? function () {} : _this$props2$afterSub;
                fields = this.state.fields;

                if (!this.blocked()) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return");

              case 5:
                params = nestedField ? this.convertFields() : _objectSpread(_objectSpread({}, fields), extraData);

                if (!this.validate()) {
                  _context3.next = 15;
                  break;
                }

                _context3.next = 9;
                return onSubmit(params);

              case 9:
                res = _context3.sent;
                _context3.next = 12;
                return this.setState({
                  submitted: true
                });

              case 12:
                if (res) {
                  _context3.next = 14;
                  break;
                }

                return _context3.abrupt("return");

              case 14:
                if (res.ok) {
                  afterSubmMessage && _utils["default"].toast(afterSubmMessage);
                  afterSubmit(res);
                }

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function submit() {
        return _submit.apply(this, arguments);
      }

      return submit;
    }()
  }, {
    key: "blocked",
    value: function blocked() {
      var alert = this.props.alert;
      var _this$state$blocked = this.state.blocked,
          blocked = _this$state$blocked === void 0 ? {} : _this$state$blocked;

      if (Object.values(blocked).some(function (s) {
        return s;
      })) {
        alert((0, _base.t)("oneSec"), (0, _base.t)("stillUploading"));
        return true;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props$afterTouc = this.props.afterTouch,
          afterTouch = _this$props$afterTouc === void 0 ? function () {} : _this$props$afterTouc;

      if (!prevState.touched && this.state.touched) {
        afterTouch();
      }
    }
  }, {
    key: "validateField",
    value: function validateField(field) {
      var direct = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var fieldProps = arguments.length > 2 ? arguments[2] : undefined;
      var _this$props3 = this.props,
          rules = _this$props3.rules,
          messages = _this$props3.messages;
      var _this$state4 = this.state,
          fields = _this$state4.fields,
          errors = _this$state4.errors;
      var validate = fieldProps.validate,
          required = fieldProps.required,
          validateMessage = fieldProps.validateMessage,
          name = fieldProps.name;
      var value = fields[field];
      var error = null;
      var valid;
      if (required) error = !_utils["default"].exists(fields[field]) && (0, _base.t)("required");

      if (validate && !error) {
        error = !validate(fields[field], fields) && (validateMessage || (0, _base.t)("error"));
      }

      if (!error && rules.field[field]) {
        valid = rules.field[field](value, fields);
        error = !valid && messages.field[field];
      }

      if (!error && name && rules.name[name]) {
        valid = rules.name[name](value, fields);
        error = !valid && messages.name[name];
      }

      var newErrors = _objectSpread(_objectSpread({}, errors), {}, _defineProperty({}, field, error));

      direct && this.setState({
        errors: newErrors
      });
      return error; // also possible to return errs instead of writing to state
    }
  }, {
    key: "validate",
    value: function validate() {
      var _this2 = this;

      var errors = this.state.errors;
      var errs = {};
      var invalid;
      this.allFormChildren().forEach(function (c) {
        var field = c.props.field;

        var error = _this2.validateField(field, false, c.props);

        errs[field] = error;
        if (!invalid && error) invalid = true;
      });
      this.setState({
        errors: errs
      });
      return !invalid;
    }
  }, {
    key: "renderLoading",
    value: function renderLoading() {
      var LoadingEl = this.props.loadingEl;

      if (this.state.loading && LoadingEl) {
        return /*#__PURE__*/_react["default"].createElement(LoadingEl, null);
      } else {
        return null;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props4 = this.props,
          children = _this$props4.children,
          debug = _this$props4.debug;
      var _this$state5 = this.state,
          errors = _this$state5.errors,
          fields = _this$state5.fields;
      return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, _react["default"].Children.map(children, function (c, idx) {
        return _this3.renderChild(c, idx);
      }), this.renderLoading());
    }
  }]);

  return Form;
}(_react.Component);

var _default = Form;
exports["default"] = _default;