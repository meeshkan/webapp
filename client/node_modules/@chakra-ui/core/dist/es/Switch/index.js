import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import Box from "../Box";
import { useColorMode } from "../ColorModeProvider";
import ControlBox from "../ControlBox";
import VisuallyHidden from "../VisuallyHidden";
var switchSizes = {
  sm: {
    width: "1.375rem",
    height: "0.75rem"
  },
  md: {
    width: "1.875rem",
    height: "1rem"
  },
  lg: {
    width: "2.875rem",
    height: "1.5rem"
  }
};
var Switch = forwardRef(function (_ref, ref) {
  var id = _ref.id,
      name = _ref.name,
      value = _ref.value,
      ariaLabel = _ref["aria-label"],
      ariaLabelledBy = _ref["aria-labelledby"],
      color = _ref.color,
      defaultIsChecked = _ref.defaultIsChecked,
      isChecked = _ref.isChecked,
      size = _ref.size,
      isDisabled = _ref.isDisabled,
      isInvalid = _ref.isInvalid,
      onChange = _ref.onChange,
      onBlur = _ref.onBlur,
      onFocus = _ref.onFocus,
      children = _ref.children,
      rest = _objectWithoutPropertiesLoose(_ref, ["id", "name", "value", "aria-label", "aria-labelledby", "color", "defaultIsChecked", "isChecked", "size", "isDisabled", "isInvalid", "onChange", "onBlur", "onFocus", "children"]);

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var width = switchSizes[size] && switchSizes[size]["width"];
  var height = switchSizes[size] && switchSizes[size]["height"];
  var stylesProps = {
    rounded: "full",
    justifyContent: "flex-start",
    width: width,
    height: height,
    bg: colorMode === "dark" ? "whiteAlpha.400" : "gray.300",
    boxSizing: "content-box",
    p: "2px",
    _checked: {
      bg: color + ".500"
    },
    _child: {
      transform: "translateX(0)"
    },
    _checkedAndChild: {
      transform: "translateX(calc(" + width + " - " + height + "))"
    },
    _focus: {
      boxShadow: "outline"
    },
    _hover: {
      cursor: "pointer"
    },
    _checkedAndHover: {
      cursor: "pointer"
    },
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed"
    }
  };
  return jsx(Box, _extends({
    as: "label",
    display: "inline-block",
    verticalAlign: "middle"
  }, rest), jsx(VisuallyHidden, {
    as: "input",
    type: "checkbox",
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
  }), jsx(ControlBox, stylesProps, jsx(Box, {
    bg: "white",
    transition: "transform 250ms",
    rounded: "full",
    size: height
  })));
});
Switch.displayName = "Switch";
Switch.defaultProps = {
  color: "blue",
  size: "md"
};
export default Switch;