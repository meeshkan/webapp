"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.useAlertIconStyle = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _colorsUtils = require("../theme/colors-utils");

var _ThemeProvider = require("../ThemeProvider");

var _ColorModeProvider = require("../ColorModeProvider");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var leftAccent = function leftAccent(props) {
  var color = props.color;
  return {
    light: _objectSpread({
      pl: 3
    }, subtle(props).light, {
      borderLeft: "4px",
      borderColor: color + ".500"
    }),
    dark: _objectSpread({
      pl: 3
    }, subtle(props).dark, {
      borderLeft: "4px",
      borderColor: color + ".200"
    })
  };
};

var topAccent = function topAccent(props) {
  var color = props.color;
  return {
    light: _objectSpread({
      pt: 2
    }, subtle(props).light, {
      borderTop: "4px",
      borderColor: color + ".500"
    }),
    dark: _objectSpread({
      pt: 2
    }, subtle(props).dark, {
      borderTop: "4px",
      borderColor: color + ".200"
    })
  };
};

var solid = function solid(_ref) {
  var color = _ref.color;
  return {
    light: {
      bg: color + ".500",
      color: "white"
    },
    dark: {
      bg: color + ".200",
      color: "gray.900"
    }
  };
};

var subtle = function subtle(_ref2) {
  var color = _ref2.color,
      colors = _ref2.theme.colors;
  var darkBg = colors[color] && colors[color][200];
  return {
    light: {
      bg: color + ".100"
    },
    dark: {
      bg: (0, _colorsUtils.colorEmphasis)(darkBg, "lowest")
    }
  };
};

var statusStyleProps = function statusStyleProps(props) {
  switch (props.variant) {
    case "solid":
      return solid(props);

    case "subtle":
      return subtle(props);

    case "top-accent":
      return topAccent(props);

    case "left-accent":
      return leftAccent(props);

    default:
      return {};
  }
};

var baseProps = {
  display: "flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  pl: 4,
  pr: 4,
  pt: 3,
  pb: 3
};

var useAlertStyle = function useAlertStyle(props) {
  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var theme = (0, _ThemeProvider.useTheme)();

  var _props = _objectSpread({}, props, {
    theme: theme
  });

  return _objectSpread({}, baseProps, {}, statusStyleProps(_props)[colorMode]);
};

var useAlertIconStyle = function useAlertIconStyle(_ref3) {
  var variant = _ref3.variant,
      color = _ref3.color;

  var _useColorMode2 = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode2.colorMode;

  if (["left-accent", "top-accent", "subtle"].includes(variant)) {
    var result = {
      light: {
        color: color + ".500"
      },
      dark: {
        color: color + ".200"
      }
    };
    return result[colorMode];
  }
};

exports.useAlertIconStyle = useAlertIconStyle;
var _default = useAlertStyle;
exports["default"] = _default;