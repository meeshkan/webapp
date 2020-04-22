"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.StatGroup = exports.StatArrow = exports.StatHelpText = exports.Stat = exports.StatNumber = exports.StatLabel = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireWildcard(require("react"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _Text = _interopRequireDefault(require("../Text"));

var _Box = _interopRequireDefault(require("../Box"));

var _Flex = _interopRequireDefault(require("../Flex"));

var StatLabel = (0, _react.forwardRef)(function (props, ref) {
  return _react["default"].createElement(_Text["default"], (0, _extends2["default"])({
    ref: ref,
    fontWeight: "medium",
    fontSize: "sm"
  }, props));
});
exports.StatLabel = StatLabel;
StatLabel.displayName = "StatLabel";
var StatHelpText = (0, _react.forwardRef)(function (props, ref) {
  return _react["default"].createElement(_Text["default"], (0, _extends2["default"])({
    ref: ref,
    fontSize: "sm",
    opacity: "0.8",
    mb: 2
  }, props));
});
exports.StatHelpText = StatHelpText;
StatHelpText.displayName = "StatHelpText";

var StatNumber = function StatNumber(props) {
  return _react["default"].createElement(_Text["default"], (0, _extends2["default"])({
    fontSize: "2xl",
    verticalAlign: "baseline",
    fontWeight: "semibold"
  }, props));
};

exports.StatNumber = StatNumber;
var arrowOptions = {
  increase: {
    name: "triangle-up",
    color: "green.400"
  },
  decrease: {
    name: "triangle-down",
    color: "red.400"
  }
};
var StatArrow = (0, _react.forwardRef)(function (_ref, ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? "increase" : _ref$type,
      ariaLabel = _ref["aria-label"],
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["type", "aria-label"]);
  return _react["default"].createElement(_Icon["default"], (0, _extends2["default"])({
    ref: ref,
    mr: 1,
    size: "14px",
    verticalAlign: "middle",
    "aria-label": ariaLabel
  }, arrowOptions[type], rest));
});
exports.StatArrow = StatArrow;
StatArrow.displayName = "StatArrow";
var Stat = (0, _react.forwardRef)(function (props, ref) {
  return _react["default"].createElement(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    flex: "1",
    pr: 4,
    position: "relative"
  }, props));
});
exports.Stat = Stat;
Stat.displayName = "Stat";
var StatGroup = (0, _react.forwardRef)(function (props, ref) {
  return _react["default"].createElement(_Flex["default"], (0, _extends2["default"])({
    ref: ref,
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start"
  }, props));
});
exports.StatGroup = StatGroup;
StatGroup.displayName = "StatGroup";