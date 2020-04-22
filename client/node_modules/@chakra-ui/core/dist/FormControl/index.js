"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.useFormControlContext = exports.useFormControl = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

/** @jsx jsx */
var useFormControl = function useFormControl(props) {
  var context = useFormControlContext();

  if (!context) {
    return props;
  }

  var keys = Object.keys(context);
  return keys.reduce(function (acc, prop) {
    /** Giving precedence to `props` over `context` */
    acc[prop] = props[prop];

    if (context) {
      if (props[prop] == null) {
        acc[prop] = context[prop];
      }
    }

    return acc;
  }, {});
};

exports.useFormControl = useFormControl;
var FormControlContext = (0, _react.createContext)();

var useFormControlContext = function useFormControlContext() {
  return (0, _react.useContext)(FormControlContext);
};

exports.useFormControlContext = useFormControlContext;
var FormControl = (0, _react.forwardRef)(function (_ref, ref) {
  var isInvalid = _ref.isInvalid,
      isRequired = _ref.isRequired,
      isDisabled = _ref.isDisabled,
      isReadOnly = _ref.isReadOnly,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["isInvalid", "isRequired", "isDisabled", "isReadOnly"]);
  var context = {
    isRequired: isRequired,
    isDisabled: isDisabled,
    isInvalid: isInvalid,
    isReadOnly: isReadOnly
  };
  return (0, _core.jsx)(FormControlContext.Provider, {
    value: context
  }, (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    role: "group",
    ref: ref
  }, rest)));
});
FormControl.displayName = "FormControl";
var _default = FormControl;
exports["default"] = _default;