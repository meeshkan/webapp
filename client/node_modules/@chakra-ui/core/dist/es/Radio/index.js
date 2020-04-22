import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import ControlBox from "../ControlBox";
import { useColorMode } from "../ColorModeProvider";
import VisuallyHidden from "../VisuallyHidden";
import useCheckboxStyle from "../Checkbox/styles";
import Box from "../Box";
import { useVariantColorWarning } from "../utils";
var Radio = forwardRef(function (_ref, ref) {
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
      rest = _objectWithoutPropertiesLoose(_ref, ["id", "name", "value", "aria-label", "aria-labelledby", "variantColor", "defaultIsChecked", "isChecked", "isFullWidth", "size", "isDisabled", "isInvalid", "onChange", "onBlur", "onFocus", "children"]);

  // Wrong usage of `variantColor` prop is quite common
  // Let's add a warning hook that validates the passed variantColor
  useVariantColorWarning("Radio", variantColor);

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var styleProps = useCheckboxStyle({
    color: variantColor,
    size: size,
    colorMode: colorMode,
    type: "radio"
  });
  return jsx(Box, _extends({
    as: "label",
    display: "inline-flex",
    verticalAlign: "top",
    htmlFor: id,
    alignItems: "center",
    width: isFullWidth ? "full" : undefined,
    cursor: isDisabled ? "not-allowed" : "pointer"
  }, rest), jsx(VisuallyHidden, {
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
  }), jsx(ControlBox, _extends({}, styleProps, {
    type: "radio",
    rounded: "full"
  }), jsx(Box, {
    bg: "currentColor",
    as: "span",
    rounded: "full",
    size: "50%"
  })), children && jsx(Box, {
    ml: 2,
    fontSize: size,
    userSelect: "none",
    opacity: isDisabled ? 0.32 : 1
  }, children));
});
Radio.displayName = "Radio";
export default Radio;