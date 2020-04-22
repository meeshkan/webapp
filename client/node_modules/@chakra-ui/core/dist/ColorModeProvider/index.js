"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.LightMode = exports.DarkMode = exports.useColorMode = exports["default"] = exports.ColorModeContext = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _core = require("@emotion/core");

var _react = require("react");

var _useDarkMode2 = _interopRequireDefault(require("use-dark-mode"));

/** @jsx jsx */
// This context handles the color mode (light or dark) of the UI
var ColorModeContext = (0, _react.createContext)({
  colorMode: "light",
  toggleColorMode: function toggleColorMode() {}
});
exports.ColorModeContext = ColorModeContext;

var ColorModeProvider = function ColorModeProvider(_ref) {
  var value = _ref.value,
      children = _ref.children;

  var _useState = (0, _react.useState)(value),
      manualMode = _useState[0],
      setManualMode = _useState[1];

  var manualToggle = function manualToggle() {
    if (manualMode === "light") {
      setManualMode("dark");
    }

    if (manualMode === "dark") {
      setManualMode("light");
    }
  };

  var _useDarkMode = (0, _useDarkMode2["default"])(false),
      isDarkMode = _useDarkMode.value,
      toggle = _useDarkMode.toggle;

  var colorMode = isDarkMode ? "dark" : "light";
  var childContext = value != null ? {
    colorMode: manualMode,
    toggleColorMode: manualToggle
  } : {
    colorMode: colorMode,
    toggleColorMode: toggle
  };
  return (0, _core.jsx)(ColorModeContext.Provider, {
    value: childContext
  }, children);
};

var DarkMode = function DarkMode(props) {
  return (0, _core.jsx)(ColorModeProvider, (0, _extends2["default"])({
    value: "dark"
  }, props));
};

exports.DarkMode = DarkMode;

var LightMode = function LightMode(props) {
  return (0, _core.jsx)(ColorModeProvider, (0, _extends2["default"])({
    value: "light"
  }, props));
};

exports.LightMode = LightMode;

var useColorMode = function useColorMode() {
  var context = (0, _react.useContext)(ColorModeContext);

  if (context === undefined) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }

  return context;
};

exports.useColorMode = useColorMode;
var _default = ColorModeProvider;
exports["default"] = _default;