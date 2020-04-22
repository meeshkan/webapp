"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _Box = _interopRequireDefault(require("../Box"));

var _ = _interopRequireDefault(require("."));

/** @jsx jsx */
var EnhancedIcon = function EnhancedIcon(_ref) {
  var icon = _ref.icon,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["icon"]);

  if (typeof icon === "string") {
    return (0, _core.jsx)(_["default"], (0, _extends2["default"])({
      focusable: "false",
      name: icon,
      color: "currentColor"
    }, props));
  }

  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: icon,
    "data-custom-icon": true,
    focusable: "false",
    color: "currentColor"
  }, props));
};

var _default = EnhancedIcon;
exports["default"] = _default;