"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _react = _interopRequireWildcard(require("react"));

var _Box = _interopRequireDefault(require("../Box"));

var Flex = (0, _react.forwardRef)(function (_ref, ref) {
  var align = _ref.align,
      justify = _ref.justify,
      wrap = _ref.wrap,
      direction = _ref.direction,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["align", "justify", "wrap", "direction"]);
  return _react["default"].createElement(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    display: "flex",
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap
  }, rest));
});
Flex.displayName = "Flex";
var _default = Flex;
exports["default"] = _default;