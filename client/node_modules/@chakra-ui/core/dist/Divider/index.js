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
var Divider = (0, _react.forwardRef)(function (_ref, ref) {
  var orientation = _ref.orientation,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["orientation"]);
  var borderProps = orientation === "vertical" ? {
    borderLeft: "0.0625rem solid",
    height: "auto",
    mx: 2
  } : {
    borderBottom: "0.0625rem solid",
    width: "auto",
    my: 2
  };
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    as: "hr",
    "aria-orientation": orientation,
    border: "0",
    opacity: "0.6"
  }, borderProps, {
    borderColor: "inherit"
  }, props));
});
var _default = Divider;
exports["default"] = _default;