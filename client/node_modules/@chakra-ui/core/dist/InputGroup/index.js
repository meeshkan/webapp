"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _Input = _interopRequireDefault(require("../Input"));

var _styles = require("../Input/styles");

var _InputElement = require("../InputElement");

var _ThemeProvider = require("../ThemeProvider");

var _utils = require("../utils");

/** @jsx jsx */
var InputGroup = function InputGroup(_ref) {
  var children = _ref.children,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? "md" : _ref$size,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["children", "size"]);

  var _useTheme = (0, _ThemeProvider.useTheme)(),
      sizes = _useTheme.sizes;

  var height = _styles.inputSizes[size] && _styles.inputSizes[size]["height"];
  var pl = null;
  var pr = null;
  var validChildren = (0, _utils.cleanChildren)(children);
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    display: "flex",
    position: "relative"
  }, props), validChildren.map(function (child) {
    if (child.type === _InputElement.InputLeftElement) {
      pl = sizes[height];
    }

    if (child.type === _InputElement.InputRightElement) {
      pr = sizes[height];
    }

    if (child.type === _Input["default"]) {
      return (0, _react.cloneElement)(child, {
        size: size,
        pl: child.props.pl || pl,
        pr: child.props.pr || pr
      });
    }

    return (0, _react.cloneElement)(child, {
      size: size
    });
  }));
};

var _default = InputGroup;
exports["default"] = _default;