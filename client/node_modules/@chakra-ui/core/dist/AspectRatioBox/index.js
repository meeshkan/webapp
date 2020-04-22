"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

/** @jsx jsx */
var AspectRatioBox = function AspectRatioBox(_ref) {
  var _ref$ratio = _ref.ratio,
      ratio = _ref$ratio === void 0 ? 4 / 3 : _ref$ratio,
      children = _ref.children,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["ratio", "children"]);

  var child = _react.Children.only(children);

  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    pos: "relative",
    _before: {
      h: 0,
      content: "\"\"",
      d: "block",
      pb: 1 / ratio * 100 + "%"
    }
  }, props), (0, _react.cloneElement)(child, {
    pos: "absolute",
    w: "full",
    h: "full",
    top: 0,
    left: 0
  }));
};

var _default = AspectRatioBox;
exports["default"] = _default;