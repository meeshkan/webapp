import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import Box from "../Box";
import { useFormControl } from "../FormControl";
import { useColorMode } from "../ColorModeProvider";
export var RequiredIndicator = function RequiredIndicator(props) {
  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var color = {
    light: "red.500",
    dark: "red.300"
  };
  return jsx(Box, _extends({
    as: "span",
    ml: 1,
    color: color[colorMode],
    "aria-hidden": "true",
    children: "*"
  }, props));
};
export var FormLabel = forwardRef(function (_ref, ref) {
  var children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, ["children"]);

  var formControl = useFormControl(props);
  return jsx(Box, _extends({
    ref: ref,
    fontSize: "md",
    pr: "12px",
    pb: "4px",
    opacity: formControl.isDisabled ? "0.4" : "1",
    fontWeight: "medium",
    textAlign: "left",
    verticalAlign: "middle",
    display: "inline-block",
    as: "label"
  }, props), children, formControl.isRequired && jsx(RequiredIndicator, null));
});
FormLabel.displayName = "FormLabel";
export default FormLabel;