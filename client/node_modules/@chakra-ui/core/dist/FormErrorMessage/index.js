"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _ColorModeProvider = require("../ColorModeProvider");

var _Flex = _interopRequireDefault(require("../Flex"));

var _FormControl = require("../FormControl");

var _Icon = _interopRequireDefault(require("../Icon"));

var _Text = _interopRequireDefault(require("../Text"));

/** @jsx jsx */
var FormErrorMessage = (0, _react.forwardRef)(function (_ref, ref) {
  var children = _ref.children,
      icon = _ref.icon,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["children", "icon"]);

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var formControl = (0, _FormControl.useFormControl)(props);
  var color = {
    light: "red.500",
    dark: "red.300"
  };

  if (!formControl.isInvalid) {
    return null;
  }

  return (0, _core.jsx)(_Flex["default"], (0, _extends2["default"])({
    ref: ref,
    color: color[colorMode],
    id: formControl.id ? formControl.id + "-error-message" : null,
    mt: 2,
    fontSize: "sm",
    align: "center"
  }, props), (0, _core.jsx)(_Icon["default"], {
    "aria-hidden": true,
    name: icon || "warning",
    mr: "0.5em"
  }), (0, _core.jsx)(_Text["default"], {
    lineHeight: "normal"
  }, children));
});
FormErrorMessage.displayName = "FormErrorMessage";
var _default = FormErrorMessage;
exports["default"] = _default;