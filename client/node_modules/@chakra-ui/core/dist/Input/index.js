"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _core = require("@emotion/core");

var _react = require("react");

var _FormControl = require("../FormControl");

var _PseudoBox = _interopRequireDefault(require("../PseudoBox"));

var _styles = _interopRequireDefault(require("./styles"));

/** @jsx jsx */
var Input = (0, _react.forwardRef)(function (props, ref) {
  var size = props.size,
      variant = props.variant,
      as = props.as,
      ariaLabel = props["aria-label"],
      ariaDescribedby = props["aria-describedby"],
      isReadOnly = props.isReadOnly,
      isFullWidth = props.isFullWidth,
      isDisabled = props.isDisabled,
      isInvalid = props.isInvalid,
      isRequired = props.isRequired,
      focusBorderColor = props.focusBorderColor,
      errorBorderColor = props.errorBorderColor,
      rest = (0, _objectWithoutPropertiesLoose2["default"])(props, ["size", "variant", "as", "aria-label", "aria-describedby", "isReadOnly", "isFullWidth", "isDisabled", "isInvalid", "isRequired", "focusBorderColor", "errorBorderColor"]);
  var inputStyleProps = (0, _styles["default"])(props);
  var formControl = (0, _FormControl.useFormControl)(props);
  return (0, _core.jsx)(_PseudoBox["default"], (0, _extends2["default"])({
    ref: ref,
    as: as,
    readOnly: formControl.isReadOnly,
    "aria-readonly": isReadOnly,
    disabled: formControl.isDisabled,
    "aria-label": ariaLabel,
    "aria-invalid": formControl.isInvalid,
    required: formControl.isRequired,
    "aria-required": formControl.isRequired,
    "aria-disabled": formControl.isDisabled,
    "aria-describedby": ariaDescribedby
  }, inputStyleProps, rest));
});
Input.displayName = "Input";
Input.defaultProps = {
  size: "md",
  as: "input",
  variant: "outline",
  isFullWidth: true,
  focusBorderColor: "blue.500",
  errorBorderColor: "red.500"
};
var _default = Input;
exports["default"] = _default;