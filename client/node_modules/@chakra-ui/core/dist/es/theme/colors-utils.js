import _taggedTemplateLiteralLoose from "@babel/runtime/helpers/taggedTemplateLiteralLoose";

function _templateObject() {
  var data = _taggedTemplateLiteralLoose(["\n  background-image: linear-gradient(\n    45deg,\n    ", " 25%,\n    transparent 25%,\n    transparent 50%,\n    ", " 50%,\n    ", " 75%,\n    transparent 75%,\n    transparent\n  );\n  background-size: ", " ", ";\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

import { css } from "@emotion/core";
import Color from "color";
export var get = function get(color, hue) {
  return color + "." + hue;
};
export var addOpacity = function addOpacity(color, opacity) {
  return Color(color).fade(1 - opacity).rgb().string();
};
export var addWhite = function addWhite(color, opacity) {
  return Color(color).mix(Color("#fff"), opacity).hex();
};
export var addBlack = function addBlack(color, opacity) {
  return Color(color).mix(Color("#000"), opacity).hex();
};
export var isDarkColor = function isDarkColor(color) {
  return Color(color).isDark();
};
export var generateAlphaColors = function generateAlphaColors(color) {
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
export var colorEmphasis = function colorEmphasis(color, emphasis) {
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
export var generateStripe = function generateStripe(_ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? "1rem" : _ref$size,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? "rgba(255, 255, 255, 0.15)" : _ref$color;
  return css(_templateObject(), color, color, color, size, size);
};