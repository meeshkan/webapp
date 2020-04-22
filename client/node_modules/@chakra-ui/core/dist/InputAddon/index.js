"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.InputRightAddon = exports.InputLeftAddon = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _Box = _interopRequireDefault(require("../Box"));

var _styles = _interopRequireDefault(require("../Input/styles"));

var _ColorModeProvider = require("../ColorModeProvider");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var InputAddon = function InputAddon(_ref) {
  var _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? "left" : _ref$placement,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? "md" : _ref$size,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["placement", "size"]);

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var bg = {
    dark: "whiteAlpha.300",
    light: "gray.100"
  };
  var _placement = {
    left: {
      mr: "-1px",
      roundedRight: 0,
      borderRightColor: "transparent"
    },
    right: {
      order: 1,
      roundedLeft: 0,
      borderLeftColor: "transparent"
    }
  };

  var styleProps = _objectSpread({}, (0, _styles["default"])({
    size: size,
    variant: "outline"
  }), {
    flex: "0 0 auto",
    whiteSpace: "nowrap",
    bg: bg[colorMode]
  }, _placement[placement]);

  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({}, styleProps, props));
};

var InputLeftAddon = function InputLeftAddon(props) {
  return (0, _core.jsx)(InputAddon, (0, _extends2["default"])({
    placement: "left"
  }, props));
};

exports.InputLeftAddon = InputLeftAddon;

var InputRightAddon = function InputRightAddon(props) {
  return (0, _core.jsx)(InputAddon, (0, _extends2["default"])({
    placement: "right"
  }, props));
};

exports.InputRightAddon = InputRightAddon;
var _default = InputAddon;
exports["default"] = _default;