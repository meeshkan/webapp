"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useMenuItemStyle = exports.useMenuListStyle = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ThemeProvider = require("../ThemeProvider");

var _ColorModeProvider = require("../ColorModeProvider");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var useMenuListStyle = function useMenuListStyle() {
  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var elevation = {
    light: {
      bg: "#fff",
      shadow: "sm"
    },
    dark: {
      bg: "gray.700",
      shadow: "rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px"
    }
  };
  return _objectSpread({
    color: "inherit",
    borderWidth: "1px"
  }, elevation[colorMode]);
};
/**
|--------------------------------------------------
| Styles for MenuItem
|--------------------------------------------------
*/


exports.useMenuListStyle = useMenuListStyle;
var baseProps = {
  width: "full",
  flex: " 0 0 auto",
  userSelect: "none",
  transition: "background-color 220ms, color 220ms"
};

var interactionProps = function interactionProps(_ref) {
  var colorMode = _ref.colorMode;
  var _focusColor = {
    light: "gray.100",
    dark: "whiteAlpha.100"
  };
  var _activeColor = {
    light: "gray.200",
    dark: "whiteAlpha.200"
  };
  return {
    _active: {
      bg: _activeColor[colorMode]
    },
    _focus: {
      bg: _focusColor[colorMode],
      outline: 0
    },
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed"
    }
  };
};

var useMenuItemStyle = function useMenuItemStyle() {
  var theme = (0, _ThemeProvider.useTheme)();

  var _useColorMode2 = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode2.colorMode;

  var props = {
    theme: theme,
    colorMode: colorMode
  };
  return _objectSpread({}, baseProps, {}, interactionProps(props));
};

exports.useMenuItemStyle = useMenuItemStyle;