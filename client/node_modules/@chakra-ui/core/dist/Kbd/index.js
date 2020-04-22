"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _core = require("@emotion/core");

var _Box = _interopRequireDefault(require("../Box"));

var _ColorModeProvider = require("../ColorModeProvider");

/** @jsx jsx */
var Kbd = function Kbd(props) {
  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var bg = {
    light: "gray.100",
    dark: "whiteAlpha.50"
  };
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: "kbd",
    bg: bg[colorMode],
    rounded: "md",
    border: "1px",
    borderColor: "inherit",
    borderBottomWidth: "3px",
    fontSize: "0.8em",
    fontWeight: "bold",
    lineHeight: "normal",
    px: "0.4em",
    whiteSpace: "nowrap"
  }, props));
};

var _default = Kbd;
exports["default"] = _default;