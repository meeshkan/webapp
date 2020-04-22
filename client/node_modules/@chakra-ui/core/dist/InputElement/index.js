"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = exports.InputRightElement = exports.InputLeftElement = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _styles = require("../Input/styles");

/** @jsx jsx */
var InputElement = (0, _react.forwardRef)(function (_ref, ref) {
  var _placementProp;

  var size = _ref.size,
      children = _ref.children,
      _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? "left" : _ref$placement,
      _ref$disablePointerEv = _ref.disablePointerEvents,
      disablePointerEvents = _ref$disablePointerEv === void 0 ? false : _ref$disablePointerEv,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["size", "children", "placement", "disablePointerEvents"]);
  var height = _styles.inputSizes[size] && _styles.inputSizes[size]["height"];
  var fontSize = _styles.inputSizes[size] && _styles.inputSizes[size]["fontSize"];
  var placementProp = (_placementProp = {}, _placementProp[placement] = "0", _placementProp);
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: height,
    width: height,
    fontSize: fontSize,
    top: "0",
    zIndex: 2,
    ref: ref
  }, disablePointerEvents && {
    pointerEvents: "none"
  }, placementProp, props), children);
});
InputElement.displayName = "InputElement";
var InputLeftElement = (0, _react.forwardRef)(function (props, ref) {
  return (0, _core.jsx)(InputElement, (0, _extends2["default"])({
    ref: ref,
    placement: "left"
  }, props));
});
exports.InputLeftElement = InputLeftElement;
InputLeftElement.displayName = "InputLeftElement";
var InputRightElement = (0, _react.forwardRef)(function (props, ref) {
  return (0, _core.jsx)(InputElement, (0, _extends2["default"])({
    ref: ref,
    placement: "right"
  }, props));
});
exports.InputRightElement = InputRightElement;
InputRightElement.displayName = "InputRightElement";
var _default = InputElement;
exports["default"] = _default;