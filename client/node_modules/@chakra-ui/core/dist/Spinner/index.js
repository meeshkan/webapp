"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _taggedTemplateLiteralLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteralLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _VisuallyHidden = _interopRequireDefault(require("../VisuallyHidden"));

function _templateObject() {
  var data = (0, _taggedTemplateLiteralLoose2["default"])(["\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

var spin = (0, _core.keyframes)(_templateObject());
var sizes = {
  xs: "0.75rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem"
};
var Spinner = (0, _react.forwardRef)(function (_ref, ref) {
  var _ref$size = _ref.size,
      size = _ref$size === void 0 ? "md" : _ref$size,
      _ref$label = _ref.label,
      label = _ref$label === void 0 ? "Loading..." : _ref$label,
      _ref$thickness = _ref.thickness,
      thickness = _ref$thickness === void 0 ? "2px" : _ref$thickness,
      _ref$speed = _ref.speed,
      speed = _ref$speed === void 0 ? "0.45s" : _ref$speed,
      color = _ref.color,
      _ref$emptyColor = _ref.emptyColor,
      emptyColor = _ref$emptyColor === void 0 ? "transparent" : _ref$emptyColor,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["size", "label", "thickness", "speed", "color", "emptyColor"]);

  var _size = sizes[size] || size;

  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    display: "inline-block",
    borderWidth: thickness,
    borderColor: "currentColor",
    borderBottomColor: emptyColor,
    borderLeftColor: emptyColor,
    borderStyle: "solid",
    rounded: "full",
    color: color,
    animation: spin + " " + speed + " linear infinite",
    size: _size
  }, props), label && (0, _core.jsx)(_VisuallyHidden["default"], null, label));
});
Spinner.displayName = "Spinner";
var _default = Spinner;
exports["default"] = _default;