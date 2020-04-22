"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _reactAnimateHeight = _interopRequireDefault(require("react-animate-height"));

var _Box = _interopRequireDefault(require("../Box"));

/** @jsx jsx */
var Collapse = (0, _react.forwardRef)(function (_ref, ref) {
  var isOpen = _ref.isOpen,
      _ref$animateOpacity = _ref.animateOpacity,
      animateOpacity = _ref$animateOpacity === void 0 ? true : _ref$animateOpacity,
      onAnimationStart = _ref.onAnimationStart,
      onAnimationEnd = _ref.onAnimationEnd,
      duration = _ref.duration,
      _ref$easing = _ref.easing,
      easing = _ref$easing === void 0 ? "ease" : _ref$easing,
      _ref$startingHeight = _ref.startingHeight,
      startingHeight = _ref$startingHeight === void 0 ? 0 : _ref$startingHeight,
      _ref$endingHeight = _ref.endingHeight,
      endingHeight = _ref$endingHeight === void 0 ? "auto" : _ref$endingHeight,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["isOpen", "animateOpacity", "onAnimationStart", "onAnimationEnd", "duration", "easing", "startingHeight", "endingHeight"]);
  return (0, _core.jsx)(_reactAnimateHeight["default"], (0, _extends2["default"])({
    duration: duration,
    easing: easing,
    animateOpacity: animateOpacity,
    height: isOpen ? endingHeight : startingHeight,
    applyInlineTransitions: false,
    css: {
      transition: "height .2s ease,opacity .2s ease-in-out,transform .2s ease-in-out",
      "&.rah-animating--to-height-zero": {
        opacity: 0,
        transform: "translateY(-0.625rem)"
      }
    }
  }, {
    onAnimationStart: onAnimationStart,
    onAnimationEnd: onAnimationEnd
  }), (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref
  }, rest)));
});
Collapse.displayName = "Collapse";
var _default = Collapse;
exports["default"] = _default;