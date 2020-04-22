"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Icon = _interopRequireDefault(require("../Icon"));

var _Spinner = _interopRequireDefault(require("../Spinner"));

var _styles = _interopRequireDefault(require("./styles"));

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _Box = _interopRequireDefault(require("../Box"));

var _utils = require("../utils");

/** @jsx jsx */
var ButtonIcon = function ButtonIcon(_ref) {
  var icon = _ref.icon,
      props = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["icon"]);

  if (typeof icon === "string") {
    return (0, _core.jsx)(_Icon["default"], (0, _extends2["default"])({
      focusable: "false",
      "aria-hidden": "true",
      name: icon,
      color: "currentColor"
    }, props));
  }

  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: icon,
    "data-custom-icon": true,
    focusable: "false",
    "aria-hidden": "true",
    color: "currentColor"
  }, props));
};

var Button = (0, _react.forwardRef)(function (_ref2, ref) {
  var isDisabled = _ref2.isDisabled,
      isLoading = _ref2.isLoading,
      isActive = _ref2.isActive,
      isFullWidth = _ref2.isFullWidth,
      children = _ref2.children,
      _ref2$as = _ref2.as,
      Comp = _ref2$as === void 0 ? "button" : _ref2$as,
      _ref2$variantColor = _ref2.variantColor,
      variantColor = _ref2$variantColor === void 0 ? "gray" : _ref2$variantColor,
      leftIcon = _ref2.leftIcon,
      rightIcon = _ref2.rightIcon,
      _ref2$variant = _ref2.variant,
      variant = _ref2$variant === void 0 ? "solid" : _ref2$variant,
      loadingText = _ref2.loadingText,
      _ref2$iconSpacing = _ref2.iconSpacing,
      iconSpacing = _ref2$iconSpacing === void 0 ? 2 : _ref2$iconSpacing,
      _ref2$type = _ref2.type,
      type = _ref2$type === void 0 ? "button" : _ref2$type,
      _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? "md" : _ref2$size,
      colorMode = _ref2.colorMode,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["isDisabled", "isLoading", "isActive", "isFullWidth", "children", "as", "variantColor", "leftIcon", "rightIcon", "variant", "loadingText", "iconSpacing", "type", "size", "colorMode"]);
  // Wrong usage of `variantColor` prop is quite common
  // Let's add a warning hook that validates the passed variantColor
  (0, _utils.useVariantColorWarning)("Button", variantColor);
  var buttonStyleProps = (0, _styles["default"])({
    color: variantColor,
    variant: variant,
    size: size,
    colorMode: colorMode
  });

  var _isDisabled = isDisabled || isLoading;

  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    disabled: _isDisabled,
    "aria-disabled": _isDisabled,
    ref: ref,
    as: Comp,
    type: type,
    borderRadius: "md",
    fontWeight: "semibold",
    width: isFullWidth ? "full" : undefined,
    "data-active": isActive ? "true" : undefined
  }, buttonStyleProps, rest), leftIcon && !isLoading && (0, _core.jsx)(ButtonIcon, {
    ml: -1,
    mr: iconSpacing,
    icon: leftIcon
  }), isLoading && (0, _core.jsx)(_Spinner["default"], {
    position: loadingText ? "relative" : "absolute",
    mr: loadingText ? iconSpacing : 0,
    color: "currentColor",
    size: "1em"
  }), isLoading ? loadingText || (0, _core.jsx)(_Box["default"], {
    as: "span",
    opacity: "0"
  }, children) : children, rightIcon && !isLoading && (0, _core.jsx)(ButtonIcon, {
    mr: -1,
    ml: iconSpacing,
    icon: rightIcon
  }));
});
Button.displayName = "Button";
var _default = Button;
exports["default"] = _default;