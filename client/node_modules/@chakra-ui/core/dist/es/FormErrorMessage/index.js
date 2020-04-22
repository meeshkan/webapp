import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";

/** @jsx jsx */
import { jsx } from "@emotion/core";
import { forwardRef } from "react";
import { useColorMode } from "../ColorModeProvider";
import Flex from "../Flex";
import { useFormControl } from "../FormControl";
import Icon from "../Icon";
import Text from "../Text";
var FormErrorMessage = forwardRef(function (_ref, ref) {
  var children = _ref.children,
      icon = _ref.icon,
      props = _objectWithoutPropertiesLoose(_ref, ["children", "icon"]);

  var _useColorMode = useColorMode(),
      colorMode = _useColorMode.colorMode;

  var formControl = useFormControl(props);
  var color = {
    light: "red.500",
    dark: "red.300"
  };

  if (!formControl.isInvalid) {
    return null;
  }

  return jsx(Flex, _extends({
    ref: ref,
    color: color[colorMode],
    id: formControl.id ? formControl.id + "-error-message" : null,
    mt: 2,
    fontSize: "sm",
    align: "center"
  }, props), jsx(Icon, {
    "aria-hidden": true,
    name: icon || "warning",
    mr: "0.5em"
  }), jsx(Text, {
    lineHeight: "normal"
  }, children));
});
FormErrorMessage.displayName = "FormErrorMessage";
export default FormErrorMessage;