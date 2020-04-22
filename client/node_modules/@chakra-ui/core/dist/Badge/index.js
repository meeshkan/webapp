"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _styles = _interopRequireDefault(require("./styles"));

var _Box = _interopRequireDefault(require("../Box"));

var _react = require("react");

var _utils = require("../utils");

/** @jsx jsx */
var Badge = (0, _react.forwardRef)(function (_ref, ref) {
  var _ref$variantColor = _ref.variantColor,
      variantColor = _ref$variantColor === void 0 ? "gray" : _ref$variantColor,
      _ref$variant = _ref.variant,
      variant = _ref$variant === void 0 ? "subtle" : _ref$variant,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["variantColor", "variant"]);
  // Wrong usage of `variantColor` prop is quite common
  // Let's add a warning hook that validates the passed variantColor
  (0, _utils.useVariantColorWarning)("Badge", variantColor);
  var badgeStyleProps = (0, _styles["default"])({
    color: variantColor,
    variant: variant
  });
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    ref: ref,
    display: "inline-block",
    px: 1,
    textTransform: "uppercase",
    fontSize: "xs",
    borderRadius: "sm",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    verticalAlign: "middle"
  }, badgeStyleProps, props));
});
Badge.displayName = "Badge";
var _default = Badge;
exports["default"] = _default;