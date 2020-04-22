"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.generateStripe = exports.colorEmphasis = exports.generateAlphaColors = exports.isDarkColor = exports.addBlack = exports.addWhite = exports.addOpacity = exports.get = void 0;

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

var _core = require("@emotion/core");

var _color = _interopRequireDefault(require("color"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\n  background-image: linear-gradient(\n    45deg,\n    ", " 25%,\n    transparent 25%,\n    transparent 50%,\n    ", " 50%,\n    ", " 75%,\n    transparent 75%,\n    transparent\n  );\n  background-size: ", " ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var get = function get(color, hue) {
  return color + "." + hue;
};

exports.get = get;

var addOpacity = function addOpacity(color, opacity) {
  return (0, _color["default"])(color).fade(1 - opacity).rgb().string();
};

exports.addOpacity = addOpacity;

var addWhite = function addWhite(color, opacity) {
  return (0, _color["default"])(color).mix((0, _color["default"])("#fff"), opacity).hex();
};

exports.addWhite = addWhite;

var addBlack = function addBlack(color, opacity) {
  return (0, _color["default"])(color).mix((0, _color["default"])("#000"), opacity).hex();
};

exports.addBlack = addBlack;

var isDarkColor = function isDarkColor(color) {
  return (0, _color["default"])(color).isDark();
};

exports.isDarkColor = isDarkColor;

var generateAlphaColors = function generateAlphaColors(color) {
  return {
    900: addOpacity(color, 0.92),
    800: addOpacity(color, 0.8),
    700: addOpacity(color, 0.6),
    600: addOpacity(color, 0.48),
    500: addOpacity(color, 0.38),
    400: addOpacity(color, 0.24),
    300: addOpacity(color, 0.16),
    200: addOpacity(color, 0.12),
    100: addOpacity(color, 0.08),
    50: addOpacity(color, 0.04)
  };
};

exports.generateAlphaColors = generateAlphaColors;

var colorEmphasis = function colorEmphasis(color, emphasis) {
  switch (emphasis) {
    case "high":
      return color;

    case "medium":
      return generateAlphaColors(color)[700];

    case "low":
      return generateAlphaColors(color)[500];

    case "lowest":
      return generateAlphaColors(color)[300];

    default:
      return;
  }
};

exports.colorEmphasis = colorEmphasis;

var generateStripe = function generateStripe(_ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? "1rem" : _ref$size,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "rgba(255, 255, 255, 0.15)" : _ref$color;
  return (0, _core.css)(_templateObject(), color, color, color, size, size);
};

exports.generateStripe = generateStripe;