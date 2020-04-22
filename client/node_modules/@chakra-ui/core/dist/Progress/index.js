"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.ProgressLabel = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

var _core = require("@emotion/core");

var _ColorModeProvider = require("../ColorModeProvider");

var _Box = _interopRequireDefault(require("../Box"));

var _colorsUtils = require("../theme/colors-utils");

var _Slider = require("../Slider");

function _templateObject2() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\n  animation: ", " 1s linear infinite;\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\n  from { background-position: 1rem 0}\n  to { background-position: 0 0 }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var stripe = (0, _core.keyframes)(_templateObject());
var stripeAnimation = (0, _core.css)(_templateObject2(), stripe);

var ProgressLabel = function ProgressLabel(props) {
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    textAlign: "center",
    width: "100%"
  }, props));
};

exports.ProgressLabel = ProgressLabel;

var ProgressIndicator = function ProgressIndicator(_ref) {
  var isIndeterminate = _ref.isIndeterminate,
      min = _ref.min,
      max = _ref.max,
      value = _ref.value,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["isIndeterminate", "min", "max", "value"]);
  var percent = (0, _Slider.valueToPercent)(value, min, max);
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    height: "100%",
    "aria-valuemax": max,
    "aria-valuemin": min,
    "aria-valuenow": isIndeterminate ? null : value,
    role: "progressbar",
    transition: "all 0.3s",
    width: percent + "%"
  }, rest));
};

var progressbarSizes = {
  lg: "1rem",
  md: "0.75rem",
  sm: "0.5rem"
};

var ProgressTrack = function ProgressTrack(_ref2) {
  var size = _ref2.size,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["size"]);
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    pos: "relative",
    height: progressbarSizes[size],
    overflow: "hidden"
  }, rest));
};

var Progress = function Progress(_ref3) {
  var _ref3$color = _ref3.color,
      color = _ref3$color === void 0 ? "blue" : _ref3$color,
      _ref3$value = _ref3.value,
      value = _ref3$value === void 0 ? 63 : _ref3$value,
      _ref3$min = _ref3.min,
      min = _ref3$min === void 0 ? 0 : _ref3$min,
      _ref3$max = _ref3.max,
      max = _ref3$max === void 0 ? 100 : _ref3$max,
      _ref3$size = _ref3.size,
      size = _ref3$size === void 0 ? "md" : _ref3$size,
      hasStripe = _ref3.hasStripe,
      isAnimated = _ref3.isAnimated,
      borderRadius = _ref3.borderRadius,
      rounded = _ref3.rounded,
      children = _ref3.children,
      isIndeterminate = _ref3.isIndeterminate,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref3, ["color", "value", "min", "max", "size", "hasStripe", "isAnimated", "borderRadius", "rounded", "children", "isIndeterminate"]);

  var _borderRadius = rounded || borderRadius;

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var trackColor = {
    light: "gray.100",
    dark: "whiteAlpha.300"
  };
  var indicatorColor = {
    light: color + ".500",
    dark: color + ".200"
  };
  var stripeStyle = {
    light: (0, _colorsUtils.generateStripe)({}),
    dark: (0, _colorsUtils.generateStripe)({
      color: "rgba(0,0,0,0.1)"
    })
  };
  return (0, _core.jsx)(ProgressTrack, (0, _extends2["default"])({
    size: size,
    bg: trackColor[colorMode],
    borderRadius: _borderRadius
  }, rest), (0, _core.jsx)(ProgressIndicator, (0, _extends2["default"])({
    min: min,
    max: max,
    value: value,
    bg: indicatorColor[colorMode],
    borderRadius: _borderRadius
  }, isIndeterminate && {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    willChange: "left, right"
  }, {
    css: [hasStripe && stripeStyle[colorMode], hasStripe && isAnimated && stripeAnimation]
  })));
};

var _default = Progress;
exports["default"] = _default;