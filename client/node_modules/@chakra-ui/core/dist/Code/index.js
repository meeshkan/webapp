"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _styles = _interopRequireDefault(require("../Badge/styles"));

var _Box = _interopRequireDefault(require("../Box"));

var _utils = require("../utils");

/** @jsx jsx */
var Code = function Code(_ref) {
  var _ref$variantColor = _ref.variantColor,
      variantColor = _ref$variantColor === void 0 ? "gray" : _ref$variantColor,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["variantColor"]);
  (0, _utils.useVariantColorWarning)("Code", variantColor);
  var badgeStyle = (0, _styles["default"])({
    variant: "subtle",
    color: variantColor
  });
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: "code",
    display: "inline-block",
    fontFamily: "mono",
    fontSize: "sm",
    px: "0.2em",
    rounded: "sm"
  }, badgeStyle, props));
};

var _default = Code;
exports["default"] = _default;