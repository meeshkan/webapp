"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.avatarSizes = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ThemeProvider = require("../ThemeProvider");

var _ColorModeProvider = require("../ColorModeProvider");

var _colorsUtils = require("../theme/colors-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// Found this on StackOverflow :)
function string2Hex(str) {
  var hash = 0;
  if (str.length === 0) return hash;

  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  var color = "#";

  for (var j = 0; j < 3; j++) {
    var value = hash >> j * 8 & 255;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
}

var avatarSizes = {
  "2xs": 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  full: "full"
};
exports.avatarSizes = avatarSizes;

var useAvatarStyle = function useAvatarStyle(_ref) {
  var size = _ref.size,
      name = _ref.name,
      showBorder = _ref.showBorder,
      borderColor = _ref.borderColor;

  var _useTheme = (0, _ThemeProvider.useTheme)(),
      colors = _useTheme.colors;

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var bg = name ? string2Hex(name) : colors.gray[400];
  var color = name ? (0, _colorsUtils.isDarkColor)(bg) ? "#fff" : "gray.800" : "#fff";
  var _borderColor = {
    light: "#fff",
    dark: "gray.800"
  };
  var baseProps = {
    display: "inline-flex",
    rounded: "full",
    alignItems: "center",
    flexShrink: "0",
    justifyContent: "center",
    position: "relative"
  };
  return _objectSpread({}, baseProps, {
    size: avatarSizes[size],
    bg: bg,
    color: color
  }, showBorder && {
    border: "2px",
    borderColor: borderColor || _borderColor[colorMode]
  });
};

var _default = useAvatarStyle;
exports["default"] = _default;