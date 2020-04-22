"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _Box = _interopRequireDefault(require("../Box"));

var _react = require("react");

/** @jsx jsx */
var sizes = {
  "2xl": ["4xl", null, "5xl"],
  xl: ["3xl", null, "4xl"],
  lg: ["xl", null, "2xl"],
  md: "xl",
  sm: "md",
  xs: "sm"
};
var Heading = (0, _react.forwardRef)(function (_ref, ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? "xl" : _ref$size,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["size"]);
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    as: "h2",
    fontSize: sizes[size],
    lineHeight: "shorter",
    fontWeight: "bold",
    fontFamily: "heading"
  }, props));
});
Heading.displayName = "Heading";
var _default = Heading;
exports["default"] = _default;