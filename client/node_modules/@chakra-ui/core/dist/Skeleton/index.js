"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

var _react = require("react");

var _ThemeProvider = require("../ThemeProvider");

var _ColorModeProvider = require("../ColorModeProvider");

var _core = require("@emotion/core");

var _Box = _interopRequireDefault(require("../Box"));

function _templateObject4() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\n  animation: ", " ", "s;\n"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\nfrom { opacity: 0; }\nto   { opacity: 1; }\n"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\n  border-color: ", " !important;\n  box-shadow: none !important;\n  opacity: 0.7;\n  // do not !important this for Firefox support\n  background: ", ";\n\n  // Prevent background color from extending to the border and overlappping\n  background-clip: padding-box !important;\n  cursor: default;\n\n  // Transparent text will occupy space but be invisible to the user\n  color: transparent !important;\n  animation: ", "s linear infinite alternate\n    ", ";\n  pointer-events: none;\n  user-select: none;\n\n  // Make pseudo-elements (CSS icons) and children invisible\n  &::before,\n  &::after,\n  * {\n    visibility: hidden !important;\n  }\n"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\nfrom {\n  border-color: ", ";\n  background: ", ";\n}\n\nto {\n  border-color: ", ";\n  background: ", ";\n}\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var skeletonGlow = function skeletonGlow(colorStart, colorEnd) {
  return (0, _core.keyframes)(_templateObject(), colorStart, colorStart, colorEnd, colorEnd);
};

var getStyle = function getStyle(_ref) {
  var colorStart = _ref.colorStart,
      colorEnd = _ref.colorEnd,
      speed = _ref.speed;
  return (0, _core.css)(_templateObject2(), colorStart, colorStart, speed, skeletonGlow(colorStart, colorEnd));
};

var fadeIn = (0, _core.keyframes)(_templateObject3());

var fadeInCss = function fadeInCss(duration) {
  return (0, _core.css)(_templateObject4(), fadeIn, duration);
};

var Skeleton = function Skeleton(props) {
  var _useTheme = (0, _ThemeProvider.useTheme)(),
      colors = _useTheme.colors;

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var defaultStart = {
    light: colors.gray[100],
    dark: colors.gray[800]
  };
  var defaultEnd = {
    light: colors.gray[400],
    dark: colors.gray[600]
  };
  var _props$colorStart = props.colorStart,
      colorStart = _props$colorStart === void 0 ? defaultStart[colorMode] : _props$colorStart,
      _props$colorEnd = props.colorEnd,
      colorEnd = _props$colorEnd === void 0 ? defaultEnd[colorMode] : _props$colorEnd,
      _props$isLoaded = props.isLoaded,
      isLoaded = _props$isLoaded === void 0 ? false : _props$isLoaded,
      _props$fadeInDuration = props.fadeInDuration,
      fadeInDuration = _props$fadeInDuration === void 0 ? 0.4 : _props$fadeInDuration,
      _props$speed = props.speed,
      speed = _props$speed === void 0 ? 0.8 : _props$speed,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(props, ["colorStart", "colorEnd", "isLoaded", "fadeInDuration", "speed"]);
  var fadeInStyle = (0, _react.useMemo)(function () {
    return fadeInCss(fadeInDuration);
  }, [fadeInDuration]);
  var skeletonStyle = (0, _react.useMemo)(function () {
    return getStyle({
      colorStart: colorStart,
      colorEnd: colorEnd,
      speed: speed
    });
  }, [colorStart, colorEnd, speed]);

  if (isLoaded) {
    return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
      css: fadeInStyle
    }, rest));
  }

  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    css: skeletonStyle,
    borderRadius: "2px"
  }, rest));
};

var _default = Skeleton;
exports["default"] = _default;