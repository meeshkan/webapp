import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef, useEffect, useRef } from "react";
import Box from "../Box";
import { useColorMode } from "../ColorModeProvider";
import ControlBox from "../ControlBox";
import Icon from "../Icon";
import VisuallyHidden from "../VisuallyHidden";
import useCheckboxStyle from "./styles";
import { useForkRef, useVariantColorWarning } from "../utils";
var Checkbox = forwardRef(function (_ref2, ref) {
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
      rest = _objectWithoutPropertiesLoose(_ref2, ["id", "name", "value", "aria-label", "aria-labelledby", "variantColor", "defaultIsChecked", "isChecked", "isFullWidth", "size", "isDisabled", "isInvalid", "isReadOnly", "onChange", "onBlur", "onFocus", "isIndeterminate", "children", "iconColor", "iconSize"]);

  // Wrong usage of `variantColor` prop is quite common
  // Let's add a warning hook that validates the passed variantColor
  useVariantColorWarning("Checkbox", variantColor);

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var styleProps = useCheckboxStyle({
    color: variantColor,
    size: size,
    colorMode: colorMode
  });
  var ownRef = useRef();

  var _ref = useForkRef(ownRef, ref);

  useEffect(function () {
    if (_ref.current) {
      _ref.current.indeterminate = Boolean(isIndeterminate);
    }
  }, [isIndeterminate, _ref]);
  return jsx(Box, _extends({
    as: "label",
    display: "inline-flex",
    verticalAlign: "top",
    alignItems: "center",
    width: isFullWidth ? "full" : undefined,
    cursor: isDisabled ? "not-allowed" : "pointer"
  }, rest), jsx(VisuallyHidden, {
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
  }), jsx(ControlBox, _extends({
    opacity: isReadOnly ? 0.8 : 1
  }, styleProps), jsx(Icon, {
    name: isIndeterminate ? "minus" : "check",
    size: iconSize,
    color: iconColor,
    transition: "transform 240ms, opacity 240ms"
  })), children && jsx(Box, {
    ml: 2,
    fontSize: size,
    userSelect: "none",
    opacity: isDisabled ? 0.4 : 1
  }, children));
});
Checkbox.displayName = "Checkbox";
export default Checkbox;