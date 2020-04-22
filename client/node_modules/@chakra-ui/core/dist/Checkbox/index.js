"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _Box = _interopRequireDefault(require("../Box"));

var _ColorModeProvider = require("../ColorModeProvider");

var _ControlBox = _interopRequireDefault(require("../ControlBox"));

var _Icon = _interopRequireDefault(require("../Icon"));

var _VisuallyHidden = _interopRequireDefault(require("../VisuallyHidden"));

var _styles = _interopRequireDefault(require("./styles"));

var _utils = require("../utils");

/** @jsx jsx */
var Checkbox = (0, _react.forwardRef)(function (_ref2, ref) {
  var id = _ref2.id,
      name = _ref2.name,
      value = _ref2.value,
      ariaLabel = _ref2["aria-label"],
      ariaLabelledBy = _ref2["aria-labelledby"],
      _ref2$variantColor = _ref2.variantColor,
      variantColor = _ref2$variantColor === void 0 ? "blue" : _ref2$variantColor,
      defaultIsChecked = _ref2.defaultIsChecked,
      isChecked = _ref2.isChecked,
      isFullWidth = _ref2.isFullWidth,
      _ref2$size = _ref2.size,
      size = _ref2$size === void 0 ? "md" : _ref2$size,
      isDisabled = _ref2.isDisabled,
      isInvalid = _ref2.isInvalid,
      isReadOnly = _ref2.isReadOnly,
      onChange = _ref2.onChange,
      onBlur = _ref2.onBlur,
      onFocus = _ref2.onFocus,
      isIndeterminate = _ref2.isIndeterminate,
      children = _ref2.children,
      iconColor = _ref2.iconColor,
      _ref2$iconSize = _ref2.iconSize,
      iconSize = _ref2$iconSize === void 0 ? "10px" : _ref2$iconSize,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["id", "name", "value", "aria-label", "aria-labelledby", "variantColor", "defaultIsChecked", "isChecked", "isFullWidth", "size", "isDisabled", "isInvalid", "isReadOnly", "onChange", "onBlur", "onFocus", "isIndeterminate", "children", "iconColor", "iconSize"]);
  // Wrong usage of `variantColor` prop is quite common
  // Let's add a warning hook that validates the passed variantColor
  (0, _utils.useVariantColorWarning)("Checkbox", variantColor);

  var _useColorMode = (0, _ColorModeProvider.useColorMode)(),
      colorMode = _useColorMode.colorMode;

  var styleProps = (0, _styles["default"])({
    color: variantColor,
    size: size,
    colorMode: colorMode
  });
  var ownRef = (0, _react.useRef)();

  var _ref = (0, _utils.useForkRef)(ownRef, ref);

  (0, _react.useEffect)(function () {
    if (_ref.current) {
      _ref.current.indeterminate = Boolean(isIndeterminate);
    }
  }, [isIndeterminate, _ref]);
  return (0, _core.jsx)(_Box["default"], (0, _extends2["default"])({
    as: "label",
    display: "inline-flex",
    verticalAlign: "top",
    alignItems: "center",
    width: isFullWidth ? "full" : undefined,
    cursor: isDisabled ? "not-allowed" : "pointer"
  }, rest), (0, _core.jsx)(_VisuallyHidden["default"], {
    as: "input",
    type: "checkbox",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    id: id,
    ref: _ref,
    name: name,
    value: value,
    onChange: isReadOnly ? undefined : onChange,
    onBlur: onBlur,
    onFocus: onFocus,
    defaultChecked: isReadOnly ? undefined : defaultIsChecked,
    checked: isReadOnly ? Boolean(isChecked) : defaultIsChecked ? undefined : isChecked,
    disabled: isDisabled,
    readOnly: isReadOnly,
    "aria-readonly": isReadOnly,
    "aria-invalid": isInvalid,
    "aria-checked": isIndeterminate ? "mixed" : isChecked
  }), (0, _core.jsx)(_ControlBox["default"], (0, _extends2["default"])({
    opacity: isReadOnly ? 0.8 : 1
  }, styleProps), (0, _core.jsx)(_Icon["default"], {
    name: isIndeterminate ? "minus" : "check",
    size: iconSize,
    color: iconColor,
    transition: "transform 240ms, opacity 240ms"
  })), children && (0, _core.jsx)(_Box["default"], {
    ml: 2,
    fontSize: size,
    userSelect: "none",
    opacity: isDisabled ? 0.4 : 1
  }, children));
});
Checkbox.displayName = "Checkbox";
var _default = Checkbox;
exports["default"] = _default;