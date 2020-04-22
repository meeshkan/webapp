"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.FormLabel = exports.RequiredIndicator = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _core = require("@emotion/core");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _FormControl = require("../FormControl");

var _ColorModeProvider = require("../ColorModeProvider");

/** @jsx jsx */
var RequiredIndicator = function RequiredIndicator(props) {
  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var color = {
    light: "red.500",
    dark: "red.300"
  };
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: "span",
    ml: 1,
    color: color[colorMode],
    "aria-hidden": "true",
    children: "*"
  }, props));
};

exports.RequiredIndicator = RequiredIndicator;
var FormLabel = (0, _react.forwardRef)(function (_ref, ref) {
  var children = _ref.children,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["children"]);
  var formControl = (0, _FormControl.useFormControl)(props);
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    fontSize: "md",
    pr: "12px",
    pb: "4px",
    opacity: formControl.isDisabled ? "0.4" : "1",
    fontWeight: "medium",
    textAlign: "left",
    verticalAlign: "middle",
    display: "inline-block",
    as: "label"
  }, props), children, formControl.isRequired && (0, _core.jsx)(RequiredIndicator, null));
});
exports.FormLabel = FormLabel;
FormLabel.displayName = "FormLabel";
var _default = FormLabel;
exports["default"] = _default;