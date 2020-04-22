"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.FormHelperText = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _core = require("@emotion/core");

var _react = require("react");

var _FormControl = require("../FormControl");

var _ColorModeProvider = require("../ColorModeProvider");

var _Text = _interopRequireDefault(require("../Text"));

/** @jsx jsx */
var FormHelperText = (0, _react.forwardRef)(function (props, ref) {
  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var formControl = (0, _FormControl.useFormControl)(props);
  var color = {
    light: "gray.500",
    dark: "whiteAlpha.600"
  };
  return (0, _core.jsx)(_Text["default"], (0, _extends2["default"])({
    mt: 2,
    ref: ref,
    id: formControl.id ? formControl.id + "-help-text" : null,
    color: color[colorMode],
    lineHeight: "normal",
    fontSize: "sm"
  }, props));
});
exports.FormHelperText = FormHelperText;
FormHelperText.displayName = "FormHelperText";
var _default = FormHelperText;
exports["default"] = _default;