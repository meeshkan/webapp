"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _Alert = require("../Alert");

var _styles = _interopRequireDefault(require("../Alert/styles"));

var _Box = _interopRequireDefault(require("../Box"));

/** @jsx jsx */
var Callout = function Callout(_ref) {
  var _ref$status = _ref.status,
      status = _ref$status === void 0 ? "info" : _ref$status,
      _ref$variant = _ref.variant,
      variant = _ref$variant === void 0 ? "subtle" : _ref$variant,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["status", "variant"]);
  var alertStyleProps = (0, _styles["default"])({
    variant: variant,
    color: _Alert.statuses[status] && _Alert.statuses[status]["color"]
  });
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({}, alertStyleProps, rest));
};

var _default = Callout;
exports["default"] = _default;