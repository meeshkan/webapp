"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _ControlBox = _interopRequireDefault(require("../ControlBox"));

var _ColorModeProvider = require("../ColorModeProvider");

var _VisuallyHidden = _interopRequireDefault(require("../VisuallyHidden"));

var _styles = _interopRequireDefault(require("../Checkbox/styles"));

var _Box = _interopRequireDefault(require("../Box"));

var _utils = require("../utils");

/** @jsx jsx */
var Radio = (0, _react.forwardRef)(function (_ref, ref) {
  var id = _ref.id,
      name = _ref.name,
      value = _ref.value,
      ariaLabel = _ref["aria-label"],
      ariaLabelledBy = _ref["aria-labelledby"],
      _ref$variantColor = _ref.variantColor,
      variantColor = _ref$variantColor === void 0 ? "blue" : _ref$variantColor,
      defaultIsChecked = _ref.defaultIsChecked,
      isChecked = _ref.isChecked,
      isFullWidth = _ref.isFullWidth,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? "md" : _ref$size,
      isDisabled = _ref.isDisabled,
      isInvalid = _ref.isInvalid,
      onChange = _ref.onChange,
      onBlur = _ref.onBlur,
      onFocus = _ref.onFocus,
      children = _ref.children,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref, ["id", "name", "value", "aria-label", "aria-labelledby", "variantColor", "defaultIsChecked", "isChecked", "isFullWidth", "size", "isDisabled", "isInvalid", "onChange", "onBlur", "onFocus", "children"]);
  // Wrong usage of `variantColor` prop is quite common
  // Let's add a warning hook that validates the passed variantColor
  (0, _utils.useVariantColorWarning)("Radio", variantColor);

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var styleProps = (0, _styles["default"])({
    color: variantColor,
    size: size,
    colorMode: colorMode,
    type: "radio"
  });
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: "label",
    display: "inline-flex",
    verticalAlign: "top",
    htmlFor: id,
    alignItems: "center",
    width: isFullWidth ? "full" : undefined,
    cursor: isDisabled ? "not-allowed" : "pointer"
  }, rest), (0, _core.jsx)(_VisuallyHidden["default"], {
    as: "input",
    type: "radio",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    id: id,
    ref: ref,
    name: name,
    value: value,
    "aria-invalid": isInvalid,
    defaultChecked: defaultIsChecked,
    onChange: onChange,
    onBlur: onBlur,
    onFocus: onFocus,
    checked: isChecked,
    disabled: isDisabled
  }), (0, _core.jsx)(_ControlBox["default"], (0, _extends2["default"])({}, styleProps, {
    type: "radio",
    rounded: "full"
  }), (0, _core.jsx)(_Box["default"], {
    bg: "currentColor",
    as: "span",
    rounded: "full",
    size: "50%"
  })), children && (0, _core.jsx)(_Box["default"], {
    ml: 2,
    fontSize: size,
    userSelect: "none",
    opacity: isDisabled ? 0.32 : 1
  }, children));
});
Radio.displayName = "Radio";
var _default = Radio;
exports["default"] = _default;