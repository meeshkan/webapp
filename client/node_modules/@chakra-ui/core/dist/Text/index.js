"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _Box = _interopRequireDefault(require("../Box"));

var Text = _react["default"].forwardRef(function (props, ref) {
  return _react["default"].createElement(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    as: "p",
    fontFamily: "body"
  }, props));
});

Text.displayName = "Text";
var _default = Text;
exports["default"] = _default;